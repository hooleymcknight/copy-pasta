import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faCheck, faSquareXmark, faPlus } from '@fortawesome/free-solid-svg-icons'
// import clipboard from 'clipboardy';

function copy(input) {
    // clipboard.writeSync(input);
    navigator.clipboard.writeText(input);
}

const Entry = (props) => {

    return (
        <div className="entry" id={props.label} data-editing={props.editing}>
                
            {props.editing == 'true'
            ?
                <>
                <div className="entry-header">
                    <input autoFocus={true} type="text" defaultValue={props.label} onChange={(e) => validateInput(e)} onKeyUp={(e) => handleKeyPress(e)}></input>
                </div>

                <div className="sub-entries">
                    <input id="sub-entry-1" type="text" defaultValue={props.subEntry1 || 'some text here'} placeholder="some text here"></input>
                    <input id="sub-entry-2" type="text" defaultValue={props.subEntry2 || ''} placeholder="more text!"></input>
                    <input id="sub-entry-3" type="text" defaultValue={props.subEntry3 || ''} placeholder='other string'></input>
                </div>

                <button id="edit" disabled={!props.validInput} onClick={(e) => props.closeEditHandler(e)}><FontAwesomeIcon icon={faCheck} /></button>
                <button id="remove" onClick={(e) => triggerRemoveModal(e)}>
                    <FontAwesomeIcon icon={faSquareXmark} />
                </button>
                </>
            :
                <>
                <div className="entry-header">
                    <h2>{props.label}</h2>
                </div>

                <button id="edit" onClick={(e) => props.openEditHandler(e)}><FontAwesomeIcon icon={faPencil} /></button>

                <div className="sub-entries">
                    <button className="copy-btn" id="sub-entry-1" onClick={(e) => copy(e.target.textContent)}>
                        {props.subEntry1}
                    </button>
                    {props.subEntry2
                        ?
                            <button className="copy-btn" id="sub-entry-2" onClick={(e) => copy(e.target.textContent)}>
                                {props.subEntry2}
                            </button>
                        :
                            ''
                    }
                    {props.subEntry3
                        ?
                            <button className="copy-btn" id="sub-entry-3" onClick={(e) => copy(e.target.textContent)}>
                                {props.subEntry3}
                            </button>
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