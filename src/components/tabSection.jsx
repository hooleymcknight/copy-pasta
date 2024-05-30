import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const ipcRenderer = window.require('electron').ipcRenderer;

const TabSection = (props) => {
    // props:
    const renamingTab = props.renamingTab;
    const entriesData = props.entriesData;
    const activeTab = props.activeTab;

    const [prevTabScroll, setPrevTabScroll] = React.useState(0);

    const addTabHandler = () => {
        const newTabNumber = entriesData.length;
        const newTab = {
            "tabName": `Tab #${newTabNumber + 1}`,
            "active": false,
            "entries": [
                {
                    "label":"Label #1",
                    "subEntry1":{
                        "content":"some text here!",
                        "hidden":false
                    },
                    "subEntry2":{
                        "content":null,
                        "hidden":false
                    },
                    "subEntry3":{
                        "content":null,
                        "hidden":false
                    }
                },
            ]
        }
        const newEntriesData = [...entriesData, newTab];
        
        const previouslyActiveTab = newEntriesData.filter(x => x.active === true)[0];
        if (previouslyActiveTab) {
            previouslyActiveTab.active = false;
        }
        newEntriesData[newTabNumber].active = true;

        ipcRenderer.send('updateSavedEntries', newEntriesData);
        props.setEntriesData(newEntriesData);
        props.setActiveTab(newTabNumber);
    }

    const tabClickHandler = (e) => {
        const tabData = entriesData.filter(x => x.tabName === e.target.id)[0];
        const newActiveTab = entriesData.indexOf(tabData);

        const newEntriesData = [...entriesData];
        const previouslyActiveTab = newEntriesData.filter(x => x.active === true)[0];
        if (previouslyActiveTab) {
            previouslyActiveTab.active = false;
        }
        newEntriesData[newActiveTab].active = true;

        // scroll to newly active tab
        let toX = e.target.offsetLeft;
        if (toX < prevTabScroll) {
            toX = toX - 50;
        }
        else {
            toX = toX + 50;
        }
        setPrevTabScroll(toX);
        e.target.closest('.tabs-section').scrollTo(toX, 0);

        // send data
        ipcRenderer.send('updateSavedEntries', newEntriesData);
        props.setActiveTab(newActiveTab);
    }

    const tabSubmitHandler = (e) => {
        const previousTabName = e.target.closest('.editing-tab').querySelector('input').dataset.previousValue;
        const newTabName = e.target.closest('.editing-tab').querySelector('input').value;
        const tab = entriesData.filter(x => x.tabName === previousTabName);

        let newEntriesData = [...entriesData];
        const newTab = tab[0];
        newTab.tabName = newTabName;
        const indexToReplace = newEntriesData.indexOf(tab[0]);
        newEntriesData[indexToReplace] = newTab;
        

        
        ipcRenderer.send('updateSavedEntries', newEntriesData); // check ipc
        props.setEntriesData(newEntriesData);
        props.setRenamingTab('');
    }

    return (
        <div className="tabs-section">
            <div className="tab-spacer"></div>
                {entriesData.map((x, index) => (
                    index === renamingTab
                    ?
                    (<div key={index} className="editing-tab">
                        <input
                            type="text"
                            key={index}
                            placeholder="Tab :)"
                            defaultValue={entriesData[activeTab]?.tabName}
                            className= "active tab"
                            data-previous-value={entriesData[activeTab]?.tabName}
                        >
                        </input>
                        <button type="button" onClick={(e) => tabSubmitHandler(e)}><FontAwesomeIcon icon={faCheck} /></button>
                    </div>)
                    :
                    (<button
                        type="button"
                        key={index}
                        id={x.tabName}
                        className={index === activeTab ? 'active tab' : 'tab'}
                        onClick={(e) => tabClickHandler(e)}
                    >
                        {x.tabName}
                    </button>)
                ))}
            <button
                type="button"
                id="add-tab"
                className="tab"
                onClick={addTabHandler}
            >
                +
            </button>
            <div className="tab-spacer"></div>
        </div>
    );
}

export default TabSection;