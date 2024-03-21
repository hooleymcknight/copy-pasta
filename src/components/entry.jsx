import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faCheck, faSquareXmark, faPlus, faEyeSlash, faTrashCan } from '@fortawesome/free-solid-svg-icons';
// import clipboard from 'clipboardy';

function copy(e) {
    // clipboard.writeSync(input);
    navigator.clipboard.writeText(e.target.value);

    const copyConfirmed = e.target.closest('.sub-entry').querySelector('.copy-confirmed');
    copyConfirmed.classList.add('show');

    setTimeout(() => {
        copyConfirmed.classList.remove('show');
    }, 3000);
}



const Entry = (props) => {
    const [SE1hidden, setSE1hidden] = React.useState(false);
    const [SE2hidden, setSE2hidden] = React.useState(false);
    const [SE3hidden, setSE3hidden] = React.useState(false);

    function hideHandler(e) {
        const container = e.target.closest('.sub-entry');
        console.log(container);
        const seNumber = container.dataset.entryId;
        console.log(seNumber);
        switch (seNumber) {
            case "1":
                setSE1hidden(!SE1hidden);
                break;
            case "2":
                setSE2hidden(!SE2hidden);
                break;
            case "3":
                setSE3hidden(!SE3hidden);
                break;
        }
        // container.querySelector('input').type = 'password';
    }

    return (
        <div className="entry" id={props.label} data-editing={props.editing}>
                
            {props.editing == 'true'
            ?
                <>
                <div className="entry-header">
                    <input autoFocus={true} type="text" defaultValue={props.label} onChange={(e) => validateInput(e)} onKeyUp={(e) => props.kpHandler(e)}></input>
                </div>

                <div className="sub-entries">
                    <div className="sub-entry" data-entry-id="1">
                        <input type={SE1hidden ? 'password' : 'text'} defaultValue={props.subEntry1 || 'some text here'} placeholder="some text here"></input>
                        <button type="button" className="hide-subentry" onClick={(e) => hideHandler(e)}><FontAwesomeIcon icon={faEyeSlash} /></button>
                    </div>
                    <div className="sub-entry" data-entry-id="2">
                        <input type={SE2hidden ? 'password' : 'text'} defaultValue={props.subEntry2 || ''} placeholder="more text!"></input>
                        <button type="button" className="hide-subentry" onClick={(e) => hideHandler(e)}><FontAwesomeIcon icon={faEyeSlash} /></button>    
                    </div>
                    <div className="sub-entry" data-entry-id="3">
                        <input type={SE3hidden ? 'password' : 'text'} defaultValue={props.subEntry3 || ''} placeholder='other string'></input>
                        <button type="button" className="hide-subentry" onClick={(e) => hideHandler(e)}><FontAwesomeIcon icon={faEyeSlash} /></button>
                    </div>
                </div>

                <button id="edit" disabled={!props.validInput} onClick={(e) => props.closeEditHandler(e)}><FontAwesomeIcon icon={faCheck} /></button>
                <button id="remove" onClick={(e) => props.trashCanHandler(e)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
                </>
            :
                <>
                <div className="entry-header">
                    <h2>{props.label}</h2>
                </div>

                <button id="edit" onClick={(e) => props.openEditHandler(e)}><FontAwesomeIcon icon={faPencil} /></button>

                <div className="sub-entries">
                    <div className="sub-entry" data-entry-id="1">
                        <input readOnly={true}
                            role="button"
                            type={SE1hidden ? 'password' : 'text'}
                            className="copy-btn"
                            id="sub-entry-3"
                            onClick={(e) => copy(e)}
                            value={props.subEntry1}>
                        </input>
                        <p className="copy-confirmed">Copied!</p>
                    </div>
                    {props.subEntry2
                        ?
                            <div className="sub-entry" data-entry-id="2">
                                <input readOnly={true}
                                    role="button"
                                    type={SE2hidden ? 'password' : 'text'}
                                    className="copy-btn"
                                    id="sub-entry-3"
                                    onClick={(e) => copy(e)}
                                    value={props.subEntry2}>
                                </input>
                                <p className="copy-confirmed">Copied!</p>
                            </div>
                            
                        :
                            ''
                    }
                    {props.subEntry3
                        ?
                            <div className="sub-entry" data-entry-id="3">
                                <input readOnly={true}
                                    role="button"
                                    type={SE3hidden ? 'password' : 'text'}
                                    className="copy-btn"
                                    id="sub-entry-3"
                                    onClick={(e) => copy(e)}
                                    value={props.subEntry3}>
                                </input>
                                <p className="copy-confirmed">Copied!</p>
                            </div>
                        :
                            ''
                    }
                </div>
                </>
            }
        </div>
    );
}

export default Entry;