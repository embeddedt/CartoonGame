import ReactDOM from 'react-dom';
import React, { Suspense } from 'react';

import Modal from './Modal';
import DocumentTitle from 'react-document-title';
import shortid from 'shortid';
import { saveAs } from 'file-saver';

import { Scene, SceneItem, useForceUpdate, DeltaType, createStockTextItem, FullscreenCartoonLoader } from './types';
let supportsStorage = true;
if(window.localStorage == undefined || window.localStorage == null)
    supportsStorage = false;

function array_move<T>(arr: T[], old_index: number, new_index: number): T[] {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing purposes
};

class ErrorBoundary extends React.Component<{}, { hasError: boolean; }> {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <div className="hugeflex-center"><h1>Something went wrong.</h1><p></p><h2>You can try refreshing the page to see if the issue persists.</h2></div>;
      }
  
      return this.props.children; 
    }
}
function createStockScene(name = "Default Scene"): Scene {
    return {
        backgroundImage: null,
        items: [
        ],
        uniqueId: shortid.generate(),
        name
    };
}

function regenerateSceneIds(newScene: Scene) {
    newScene.uniqueId = shortid.generate();
    for(var i = 0; i < newScene.items.length; i++) {
        (newScene.items[i] as SceneItem).id = shortid.generate();
    }
}

function createDefaultScene() {
    let scene: Scene = {"backgroundImage":null,"items":[{"type":"image","imageURL":"images/png/bubble1.png","id":"2mUL0w-E","x":34.9305976141204,"y":28.661122911082735,"scale":1.496211031776488,"rotation":-10,"zIndex":1000,"isLocked":true,"flipped":false},{"type":"text","text":"Welcome!","id":"UC5TfTAR","x":58.31597221690403,"y":60.307690570188655,"scale":1.4411911939716493,"rotation":-10,"zIndex":1000,"isLocked":true,"flipped":false},{"type":"text","text":"Right click (or press and hold)\nto begin adding items.\n\nYou can also lock items to\nprevent accidental movement\nor deletion.","id":"L_AdkxE7","x":32,"y":155,"scale":1,"rotation":0,"zIndex":1000,"isLocked":false,"flipped":false}],"uniqueId":"RZAU3qVL","name":"Default Scene"};
    regenerateSceneIds(scene);
    return scene;
}
let scenes: Scene[] = [
    createDefaultScene()
];



const CartoonScreen = React.lazy(() => import('./CartoonScreen'));

function SceneCard(props) {
    return <div className="scene-card hoverable-button" {...props}>
        <span>{props.children}</span>
    </div>;
}

function saveScenes() {
    if(!supportsStorage)
        return;
    const serialized = JSON.stringify(scenes);
    try {
        window.localStorage.setItem('embeddedt-cartoon-scenes', serialized);
    } catch(e) {
        console.error("Failed to save scene data");
        console.error(e);
    }
}
function App(props) {
    const [ currentSceneIdx, setSceneIdx ] = React.useState(-1);
    const [ indexToDelete, setIndexToDelete ] = React.useState(-1);
    const [ nameChangingIndex, setNameChangingIndex ] = React.useState(-1);
    const [ isNameValid, setNameValid ] = React.useState(true);
    const [ isLoadingScene, setLoadingScene ] = React.useState(false);
    const [ hasWarnedStorage, setHasWarnedStorage ] = React.useState(supportsStorage);
    const sceneNameInput = React.useRef<HTMLInputElement>(null);
    const forceUpdate = useForceUpdate();
    const onSceneUpdate = (scene) => {
        saveScenes();
    };
    const addScene = () => {
        const scene = createStockScene("Untitled");
        scenes.push(scene);
        onSceneUpdate(scene);
        forceUpdate();
    };
    const onChangeSceneIdx = (delta: DeltaType) => {
        if(delta == 'menu') {
            setSceneIdx(-1);
        } else {
            let newSceneIdx = currentSceneIdx + delta;
            if(newSceneIdx >= scenes.length)
                newSceneIdx = scenes.length - 1;
            else if(newSceneIdx < 0)
                newSceneIdx = 0;
            setSceneIdx(newSceneIdx);
        }
    };
    const onDeleteSceneCard = (index: number, e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIndexToDelete(index);
    };
    const doDeleteScene = () => {
        scenes.splice(indexToDelete, 1);
        setIndexToDelete(-1);
        onSceneUpdate(null);
        forceUpdate();
    };
    const onMoveSceneInOrder = (sceneIndex: number, delta: number, e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const newIndex = sceneIndex + delta;;
        if(newIndex >= scenes.length)
            return;
        if(newIndex < 0)
            return;
        array_move(scenes, sceneIndex, newIndex);
        onSceneUpdate(null);
        forceUpdate();
    }
    const onChangeSceneName = (sceneIndex: number, e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setNameChangingIndex(sceneIndex);
    };
    const doRenameScene = () => {
        let newName = sceneNameInput.current.value;
        if(newName.trim().length == 0)
            newName = "Untitled scene";
        scenes[nameChangingIndex].name = newName;
        setNameChangingIndex(-1);
        onSceneUpdate(null);
        forceUpdate();
    };
    const onSceneCardClick = (index: number, e: React.SyntheticEvent) => {
        e.preventDefault();
        if(e.target != e.currentTarget)
            return;
        setSceneIdx(index);
    };
    const onNameChange = () => {
        const name = sceneNameInput.current.value;
        setNameValid(name.trim().length > 0);
    };
    const doSaveToDisk = () => {
        const serialized = JSON.stringify(scenes);
        const blob = new Blob([ serialized ], {type: "application/json"});
        saveAs(blob, "cartoon.json");
    };
    const doLoadFromDisk = (e: React.SyntheticEvent<HTMLInputElement>) => {
        setLoadingScene(true);
        const target = e.target as HTMLInputElement;
        const file    = target.files[0];
        const reader  = new FileReader();

        reader.addEventListener("load", function () {
            doHandleLoadingSavedVersion(reader.result as string);
            target.value = '';
            setLoadingScene(false);
        }, false);
        reader.addEventListener('error', function() {
            window.alert("There was an error reading the file from disk.");
            target.value = '';
            setLoadingScene(false);
        });

        console.log("Begin loading");
        if (file) {
            reader.readAsText(file);
        }
    };
    const onDuplicateScene = (index: number) => {
        let newScene: Scene = JSON.parse(JSON.stringify(scenes[index]));
        newScene.name = "Copy of " + newScene.name;
        regenerateSceneIds(newScene);
        scenes.splice(index+1, 0, newScene);
        onSceneUpdate(newScene);
        forceUpdate();
    };
    if(currentSceneIdx == -1)
        return <DocumentTitle title="Cartoon Constructor">
            <>
                <div className="hugeflex-center" style={{justifyContent: 'flex-start'}}>
                    <h1>Cartoon Constructor</h1>
                    <h2>Choose a scene:</h2>
                    <div className="scenelist-container">
                        {scenes.map((scene, index) => <SceneCard key={scene.uniqueId} onClick={onSceneCardClick.bind(this, index)}>
                            <a href="#" onClick={onSceneCardClick.bind(this, index)}>{scene.name}</a>
                            <span className="scene-card-controls">
                                <span>
                                    <button className="hoverable-button" title="Rename scene" onClick={onChangeSceneName.bind(this, index)}><i className="fas fa-font"></i></button>
                                    <button className="hoverable-button" title="Duplicate scene" onClick={onDuplicateScene.bind(this, index)}><i className="fas fa-copy"></i></button>
                                    <button className="hoverable-button" title="Delete scene" onClick={onDeleteSceneCard.bind(this, index)}><i className="fas fa-trash"></i></button>
                                </span>
                                <span>
                                    <button className="hoverable-button" title="Move scene up in list" onClick={onMoveSceneInOrder.bind(this, index, -1)}
                                        disabled={index > 0 ? null : true}><i className="fas fa-chevron-up"></i></button>
                                    <button className="hoverable-button" title="Move scene down in list" onClick={onMoveSceneInOrder.bind(this, index, 1)}
                                        disabled={index < (scenes.length - 1) ? null : true}><i className="fas fa-chevron-down"></i></button>
                                </span>
                            </span>
                        </SceneCard>)}
                        <SceneCard onClick={addScene} style={{ textAlign: 'center' }}>Add scene&nbsp;
                            <span className="scene-card-controls"><button className="hoverable-button"><i className="fas fa-plus-circle"></i></button></span>
                        </SceneCard>
                    </div>
                    <p></p>
                    <button onClick={doSaveToDisk} className="scene-card-button save-control-button hoverable-button"><i className="fas fa-download"></i>&nbsp;Save unfinished cartoon</button>
                    <label htmlFor="load-cartoon" style={{position: 'relative'}} className="scene-card-button save-control-button hoverable-button">
                        <i className="fas fa-file-upload"></i>
                        &nbsp;
                        Load unfinished cartoon
                        <input disabled={isLoadingScene ? true : null} id="load-cartoon" name="load-cartoon" style={{position: 'absolute', visibility: 'hidden', zIndex: -1}}
                            type="file" accept="application/json,.json" onChange={doLoadFromDisk}/>
                    </label>
                    
                </div>
                <Modal isOpen={indexToDelete != -1} className="rm-content">
                    <div className="rm-padding">
                        <h2>Are you sure you want to delete {indexToDelete != -1 ? scenes[indexToDelete].name : "no-name"}?</h2>
                        <p></p>
                        <button className="scene-card-button hoverable-button" onClick={doDeleteScene}>Yes</button>&nbsp;<button className="scene-card-button hoverable-button"
                            onClick={() => setIndexToDelete(-1)}>No</button>
                    </div>
                </Modal>
                <Modal isOpen={nameChangingIndex != -1} className="rm-content">
                    <div className="rm-padding">
                        <h2>Enter a new name for the scene.</h2>
                        <p></p>
                        <input ref={sceneNameInput} type="text" onChange={onNameChange} defaultValue={nameChangingIndex != -1 ? scenes[nameChangingIndex].name : "no-name"}/>
                        <button className="scene-card-button hoverable-button" onClick={doRenameScene} disabled={isNameValid ? null: true}>Rename scene</button>
                    </div>
                </Modal>
                <Modal isOpen={!hasWarnedStorage} className="rm-content">
                    <div className="rm-padding">
                        <h2>Warning</h2>
                        Your browser does not support web storage. Cartoon Constructor will be unable
                        to save your cartoon in the browser. You will have to manually save the cartoon file to your
                        device from the scene selection page.
                        <p></p>
                        <button className="scene-card-button hoverable-button" onClick={() => setHasWarnedStorage(true)}>OK</button>
                    </div>
                </Modal>
            </>
        </DocumentTitle>;
    else
        return <DocumentTitle title={"Cartoon Constructor - " + (scenes[currentSceneIdx].name)}>
            <ErrorBoundary>
                <Suspense fallback={<FullscreenCartoonLoader/>}>
                    <CartoonScreen allowPrevious={(currentSceneIdx-1) >= 0} allowNext={(currentSceneIdx) < (scenes.length-1)}
                                onGoBack={() => setSceneIdx(-1)} scene={scenes[currentSceneIdx]}
                                onSceneValsChange={onSceneUpdate} onChangeSceneIdx={onChangeSceneIdx}/>
                </Suspense>
            </ErrorBoundary>
        </DocumentTitle>;
}




function doHandleLoadingSavedVersion(savedString: string) {
    let isValid = false;
    let saved: any;
    try {
        saved = JSON.parse(savedString);
        if(Array.isArray(saved)) {
            isValid = !saved.some((scene: Scene, index) => {
                if(typeof scene.uniqueId == 'undefined')
                    return true;
                if(typeof scene.name == 'undefined')
                    scene.name = 'Scene ' + (index+1);
                scene.items.forEach((item) => {
                    if(typeof item.zIndex == 'undefined')
                        item.zIndex = 1000;
                });
                return false;
            });
        }
    } catch(e) {

    }
    if(isValid)
        scenes = saved as Scene[];
    else
        window.alert("The saved cartoon file could not be loaded.");
}
const useSaved = true;
let storageSaved = undefined;
if(supportsStorage) {
    try {
        storageSaved = window.localStorage.getItem('embeddedt-cartoon-scenes');
    } catch(e) {
        supportsStorage = false;
        console.error("Cannot read from web storage");
        console.error(e);
    }
}


if(storageSaved != undefined) {
    if(useSaved)
        doHandleLoadingSavedVersion(storageSaved);
    saveScenes();
}

window.onload = function() {
    ReactDOM.render(<App/>, document.getElementById('game-container'));
};
