import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faCheck, faEyeSlash, faTrashCan } from '@fortawesome/free-solid-svg-icons';
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
    const [SE1hidden, setSE1hidden] = React.useState(props.subEntry1.hidden);
    const [SE2hidden, setSE2hidden] = React.useState(props.subEntry2.hidden);
    const [SE3hidden, setSE3hidden] = React.useState(props.subEntry3.hidden);

    function hideHandler(e) {
        const container = e.target.closest('.sub-entry');
        const seNumber = container.dataset.entryId;
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
    }

    return (
        <div className="entry" id={props.label} data-editing={props.editing}>
                
            {props.editing == 'true'
            ?
                <>
                <div className="entry-header">
                    <input autoFocus={true} type="text" defaultValue={props.label} onChange={(e) => props.onEntry(e)} onKeyUp={(e) => props.kpHandler(e)}></input>
                </div>

                <div className="sub-entries">
                    <div className="sub-entry" data-entry-id="1">
                        <input type={SE1hidden ? 'password' : 'text'} defaultValue={props.subEntry1.content || 'some text here'} placeholder="some text here"></input>
                        <button type="button" className={SE1hidden ? 'hide-subentry entry-hidden' : 'hide-subentry'} onClick={(e) => hideHandler(e)}><FontAwesomeIcon icon={faEyeSlash} /></button>
                    </div>
                    <div className="sub-entry" data-entry-id="2">
                        <input type={SE2hidden ? 'password' : 'text'} defaultValue={props.subEntry2.content || ''} placeholder="more text!"></input>
                        <button type="button" className={SE2hidden ? 'hide-subentry entry-hidden' : 'hide-subentry'} onClick={(e) => hideHandler(e)}><FontAwesomeIcon icon={faEyeSlash} /></button>    
                    </div>
                    <div className="sub-entry" data-entry-id="3">
                        <input type={SE3hidden ? 'password' : 'text'} defaultValue={props.subEntry3.content || ''} placeholder='other string'></input>
                        <button type="button" className={SE3hidden ? 'hide-subentry entry-hidden' : 'hide-subentry'} onClick={(e) => hideHandler(e)}><FontAwesomeIcon icon={faEyeSlash} /></button>
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
                            value={props.subEntry1.content}>
                        </input>
                        <p className="copy-confirmed">Copied!</p>
                    </div>
                    {props.subEntry2.content
                        ?
                            <div className="sub-entry" data-entry-id="2">
                                <input readOnly={true}
                                    role="button"
                                    type={SE2hidden ? 'password' : 'text'}
                                    className="copy-btn"
                                    id="sub-entry-3"
                                    onClick={(e) => copy(e)}
                                    value={props.subEntry2.content}>
                                </input>
                                <p className="copy-confirmed">Copied!</p>
                            </div>
                            
                        :
                            ''
                    }
                    {props.subEntry3.content
                        ?
                            <div className="sub-entry" data-entry-id="3">
                                <input readOnly={true}
                                    role="button"
                                    type={SE3hidden ? 'password' : 'text'}
                                    className="copy-btn"
                                    id="sub-entry-3"
                                    onClick={(e) => copy(e)}
                                    value={props.subEntry3.content}>
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