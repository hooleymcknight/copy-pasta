import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faCheck, faSquareXmark, faPlus } from '@fortawesome/free-solid-svg-icons'
import Entry from "./components/entry.jsx";
import ConfirmModal from './components/confirmModal.jsx';
import TabSection from './components/tabSection.jsx';
const ipcRenderer = window.require('electron').ipcRenderer;

// ipcRenderer.on('darkModeToggle', (event, data) => {
//     if (data) {
//         document.documentElement.classList.add('dark-mode');
//     }
//     else {
//         document.documentElement.classList.remove('dark-mode');
//     }
// })

const CopyPasta = () => {

    const [activeTab, setActiveTab] = React.useState(0); // index in entriesData, default is the first one
    const [entriesData, setEntriesData] = React.useState([]);
    const [editing, setEditing] = React.useState('');
    const [deleting, setDeleting] = React.useState([]);
    const [renamingTab, setRenamingTab] = React.useState('');
    
    const [isInputValid, setIsInputValid] = React.useState(true);
    const [isAggro, setIsAggro] = React.useState(false);

    // clear everything out so we're not getting a bunch of listener duplicates
    ipcRenderer.removeAllListeners();

    ipcRenderer.on('aggroModeToggle', (event, data) => {
        setIsAggro(data);
    });

    ipcRenderer.on('deleteActiveTab', () => {
        setDeleting(['tab', activeTab]);
    });
    ipcRenderer.on('renameActiveTab', () => {
        setRenamingTab(activeTab);
    });

    const openEditName = (e) => {
        console.log('open edit name');
        const container = e.target.closest('.entries-section');
        const entryId = container.querySelector('.entry').id;
        setEditing(entryId);
    }

    const handleKeyPress = (e) => {
        if (!e.code) return;

        if (e.code === 'Enter' && isInputValid) {
            closeEditName(e);
        }
        else if (e.code === 'Escape') {
            setEditing('');
        }
    }

    const closeEditName = (e) => {
        console.log('close edit name');
        const container = e.target.closest('.entries-section');
        const newName = container.querySelector('input').value;
        const currentName = container.querySelector('.entry').id;

        const newSubEntry1 = {
            "content": container.querySelector('[data-entry-id="1"] input').value,
            "hidden": container.querySelector('[data-entry-id="1"] button').classList.contains('entry-hidden'),
        }
        const newSubEntry2 = {
            "content": container.querySelector('[data-entry-id="2"] input').value,
            "hidden": container.querySelector('[data-entry-id="2"] button').classList.contains('entry-hidden'),
        }
        const newSubEntry3 = {
            "content": container.querySelector('[data-entry-id="3"] input').value,
            "hidden": container.querySelector('[data-entry-id="3"] button').classList.contains('entry-hidden'),
        }

        const newEntriesData = [...entriesData];
        const currentEntry = newEntriesData[activeTab].entries.filter(x => x.label === currentName)[0];
        const indexToReplace = newEntriesData[activeTab].entries.indexOf(currentEntry);
        newEntriesData[activeTab].entries[indexToReplace] = {
            label: newName,
            subEntry1: newSubEntry1,
            subEntry2: newSubEntry2,
            subEntry3: newSubEntry3,
        };
        
        ipcRenderer.send('updateSavedEntries', newEntriesData);
        setEditing('');
        setEntriesData(newEntriesData);
    }

    const validateInput = (e) => {
        const currentIndex = e.target.closest('.entries-section').dataset.index;
        const matchingIds = e.target.closest('.copy-pasta-app').querySelectorAll(`.entries-section:not([data-index="${currentIndex}"]) .entry[id="${e.target.value}"]`);
        if (e.target.value.length < 2 || matchingIds.length) {
            setIsInputValid(false);
        }
        else {
            setIsInputValid(true);
        }
    }

    const addHandler = () => { // this has been updated
        console.log('add handler');
        const newItemNumber = entriesData[activeTab].entries.length + 1;
        const newItem = {
            label: `Entry #${newItemNumber}`,
            subEntry1: { "content": "some text here", "hidden":false },
            subEntry2: { "content": null, "hidden":false },
            subEntry3: { "content": null, "hidden":false },
        }
        
        const newEntriesData = [...entriesData];
        newEntriesData[activeTab].entries.push(newItem);

        setEntriesData(newEntriesData);
        setEditing(`Entry #${newItemNumber}`);
    }

    const triggerRemoveModal = (e) => {
        console.log('trigger remove modal');
        const container = e.target.closest('.entries-section'); // update this class and the next
        const entryId = container.querySelector('.entry').id;

        setDeleting(['entry', entryId]);
    }

    const removeHandler = (input) => {
        // if deleting an entry:
        if (input[0] === 'entry') {
            let newEntriesData = [...entriesData];
            newEntriesData[activeTab].entries = newEntriesData[activeTab].entries.filter(x => x.label !== input[1]);
            ipcRenderer.send('updateSavedEntries', newEntriesData);
            setEntriesData(newEntriesData);
            setDeleting([]);
        }
        else { // if deleting a whole tab
            let newEntriesData = [...entriesData];
            newEntriesData.splice(activeTab, 1);
            let newActiveTab = 0;
            if (activeTab > 1) {
                newActiveTab = activeTab - 1;
            }
            ipcRenderer.send('updateSavedEntries', newEntriesData);
            setEntriesData(newEntriesData);
            setActiveTab(newActiveTab);
            setDeleting([]);
        }
    }

    React.useEffect(() => {
        // ipcRenderer.send('requestAggro');
        // ipcRenderer.on('sendAggroState', (event, data) => {
        //     setIsAggro(data);
        // });

        ipcRenderer.on('loadSavedEntriesReply', (event, data) => {
            setEntriesData(data);
        });

        if (entriesData[activeTab]?.entries?.length > 0) return;
        ipcRenderer.send('loadSavedEntries', []);
    }, [entriesData]);

    return (
        <main className="copy-pasta-app">
            <TabSection
                entriesData={entriesData} activeTab={activeTab} renamingTab={renamingTab}
                setEntriesData={(x) => setEntriesData(x)} setActiveTab={(x) => setActiveTab(x)} setRenamingTab={(x) => setRenamingTab(x)}
            >
            </TabSection>
            {
                entriesData[activeTab]?.entries?.length
                ?
                entriesData[activeTab]?.entries.map((x, idx) =>
                    <div key={x.label} className="entries-section" data-index={idx} data-count-on-load={x.count}>
                        <Entry label={x.label}
                            subEntry1={x.subEntry1} subEntry2={x.subEntry2} subEntry3={x.subEntry3}
                            editing={editing == x.label ? 'true' : 'false'}
                            onStop={(e) => stopHandler(e)}
                            closeEditHandler={(e) => closeEditName(e)}
                            openEditHandler={(e) => openEditName(e)}
                            validInput={isInputValid}
                            trashCanHandler={(e) => triggerRemoveModal(e)}
                            kpHandler={(e) => handleKeyPress(e)}
                            onEntry={(e) => validateInput(e)}
                        ></Entry>
                    </div>
                )
                :
                ''
            }
            <button className="btn" id="add" onClick={() => addHandler()}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
            {deleting.length ?
                <ConfirmModal type={deleting[0]} label={deleting[1]} tabLabel={entriesData[activeTab].tabName} aggro={isAggro} onDelete={(e) => removeHandler(deleting)} onCancel={() => setDeleting([])} />
            :
                ''
            }
        </main>
    );
}

export default CopyPasta;