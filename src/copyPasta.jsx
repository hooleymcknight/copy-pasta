import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faCheck, faSquareXmark, faPlus } from '@fortawesome/free-solid-svg-icons'
import Entry from "./components/entry.jsx";
import ConfirmModal from './components/confirmModal.jsx';
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
    const [entriesData, setEntriesData] = React.useState([]);
    const [timersData, setTimersData] = React.useState([]);

    const [editing, setEditing] = React.useState('');
    const [isInputValid, setIsInputValid] = React.useState(true);
    const [deleting, setDeleting] = React.useState('');
    const [isAggro, setIsAggro] = React.useState(false);

    ipcRenderer.on('aggroModeToggle', (event, data) => {
        setIsAggro(data);
    })

    ipcRenderer.on('updateTime', (event, data) => {
        let newData = JSON.parse(data);
        const newTimersData = [...timersData];
        const indexToReplace = newTimersData.indexOf(newTimersData.filter(x => x.name === newData.id)[0]);
        newTimersData[indexToReplace] = { name: newData.id, count: Number(newData.count) };
        setTimersData(newTimersData);
    })

    const stopHandler = (timer, closingWindow) => {
        const newCount = timer.dataset.count;
        const timerId = timer.id;

        const newTimersData = [...timersData];
        const indexToReplace = newTimersData.indexOf(newTimersData.filter(x => x.name === timerId)[0]);
        newTimersData[indexToReplace] = { name: timerId, count: newCount };
        ipcRenderer.send('updateSavedTimers', newTimersData);

        if (closingWindow) {
            ipcRenderer.send('closeWindow');
        }
        else {
            setTimersData(newTimersData);
        }
    }

    const openEditName = (e) => {
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
        const container = e.target.closest('.entries-section');
        const newName = container.querySelector('input').value;
        const currentName = container.querySelector('.entry').id;

        const newSubEntry1 = container.querySelector('[data-entry-id="1"] input').value;
        const newSubEntry2 = container.querySelector('[data-entry-id="2"] input').value;
        const newSubEntry3 = container.querySelector('[data-entry-id="3"] input').value;

        const newEntriesData = [...entriesData];
        const currentEntry = newEntriesData.filter(x => x.label === currentName)[0];
        const indexToReplace = newEntriesData.indexOf(currentEntry);
        newEntriesData[indexToReplace] = {
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
        const newItemNumber = entriesData.length + 1;
        const newItem = {
            label: `Entry #${newItemNumber}`,
            subEntry1: 'some text here',
            subEntry2: null,
            subEntry3: null,
        }
        const newEntriesData = [...entriesData, newItem];
        ipcRenderer.send('addOrDelete', newEntriesData);
        setEntriesData(newEntriesData);
        setEditing(`Entry #${newItemNumber}`);
    }

    const triggerRemoveModal = (e) => {
        const container = e.target.closest('.entries-section'); // update this class and the next
        const entryId = container.querySelector('.entry').id;

        setDeleting(entryId);
    }

    const removeHandler = (e, entryId) => {
        const container = e.target.closest('.copy-pasta-app').querySelector(`[id="${entryId}"]`);

        let newEntriesData = [...entriesData];
        newEntriesData = newEntriesData.filter(x => x.name !== entryId);
        ipcRenderer.send('addOrDelete', newEntriesData);
        setEntriesData(newEntriesData);
        setDeleting('');
    }

    React.useEffect(() => {
        ipcRenderer.on('stopAllTimers', (event) => {
            const activeTimers = document.querySelectorAll('.entry.active');
            if (activeTimers.length) {
                activeTimers.forEach((timer) => {
                    stopHandler(timer);
                });
            }
        });

        ipcRenderer.on('saveTimers', () => {
            const activeTimers = document.querySelectorAll('.entry.active');
            if (activeTimers.length) {
                activeTimers.forEach((timer) => {
                    stopHandler(timer, true);
                    ipcRenderer.send('saveTimersReply', entriesData);
                });
            }
            else {
                ipcRenderer.send('closeWindow');
            }
        });

        // ipcRenderer.send('requestAggro');
        // ipcRenderer.on('sendAggroState', (event, data) => {
        //     setIsAggro(data);
        // });

        ipcRenderer.on('loadSavedEntriesReply', (event, data) => {
            setEntriesData(data);
        });

        if (entriesData.length > 0) return;
        ipcRenderer.send('loadSavedEntries', []);
    }, [entriesData]);

    return (
        <main className="copy-pasta-app">
            {
                entriesData.map((x, idx) => 
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
                        ></Entry>
                    </div>
                )
            }
            <button className="btn" id="add" onClick={() => addHandler()}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
            {deleting ?
                <ConfirmModal label={deleting} aggro={isAggro} onDelete={(e) => removeHandler(e, deleting)} onCancel={() => setDeleting('')} />
            :
                ''
            }
        </main>
    );
}

export default CopyPasta;