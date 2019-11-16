
import React, { Suspense } from 'react';
import { SceneItem, TextSceneItem, ImageSceneItem, Scene, createStockTextItem, createStockImageItem, useForceUpdate, CartoonLoader, DeltaType, FullscreenCartoonLoader } from './types';
import { Menu } from 'react-contexify/src/components/Menu';
import { Item } from 'react-contexify/src/components/Item';
import { Separator } from 'react-contexify/src/components/Separator';
import { contextMenu } from 'react-contexify/src/utils/contextMenu';
import ImageSelector from './ImageSelector';
const Moveable = React.lazy(() => import("react-moveable"));
import shortid from 'shortid';
import Modal from './Modal';

function isTextItem(item: SceneItem): item is TextSceneItem {
    return item.type == 'text';
}
function isImageItem(item: SceneItem): item is ImageSceneItem {
    return item.type == 'image';
}

const TestComponent = React.lazy(() => new Promise((resolve, reject) => {

}));
function CartoonSceneItem(props) {
    let innerContent;
    const preventDefault = (e) => e.preventDefault();
    const forceUpdate = useForceUpdate();
    const [ isBeingDragged, setBeingDragged ] = React.useState(false);
    const moveable = React.useRef(null);
    const [ inEditMode, setEditMode ] = React.useState(false);
    const [ imageHasLoaded, setImageHasLoaded ] = React.useState(false);

    const onDragHandler = (e: any) => {
        props.item.x = e.beforeTranslate[0];
        props.item.y = e.beforeTranslate[1];
        props.onVisualUpdate();
        forceUpdate();
    };
    const onRotateHandler = ({ target, beforeRotate }) => {
        props.item.rotation = beforeRotate;
        props.onVisualUpdate();
        forceUpdate();
    }
    const onScaleHandler = (e: any) => {
        props.item.scale *= e.delta[0];
        props.item.x += e.drag.beforeDelta[0];
        props.item.y += e.drag.beforeDelta[1];
        props.onVisualUpdate();
        forceUpdate();
    };
    const onTextMouseDown = (e: any) => {
        
        if(props.item.isLocked) {
            e.target.focus();
            props.onItemFocus(props.item);
        }
    };
    const onTextDoubleClick = () => {
        if(props.isFocused && !props.item.isLocked && !inEditMode && !isBeingDragged) {
            setEditMode(true);
        }
    };
    
    const textRef = React.useRef(null);
    React.useEffect(() => {
        if(inEditMode)
            textRef.current.focus();
    }, [ inEditMode ]);
    const onTextBlur = () => {
        if(inEditMode)
            setEditMode(false);
    };
    const onTextInput = (e) => {
        if(typeof props.onTextInput == 'function')
            props.onTextInput(e);
        if(!isBeingDragged)
            moveable.current.updateRect();
    };
    const onLoadImg = () => {
        setImageHasLoaded(true);
    };
    if(isTextItem(props.item)) {
        innerContent = <span onBlur={onTextBlur} ref={textRef} spellCheck={false} onMouseDown={onTextMouseDown} onDoubleClick={onTextDoubleClick}
            onTouchStart={onTextMouseDown} contentEditable={!props.item.isLocked && inEditMode} suppressContentEditableWarning={true}
            className={"cartoon-textbox" + (inEditMode ? " cartoon-text-edit-mode" : "")} onInput={onTextInput} dangerouslySetInnerHTML={{ __html: props.item.text}}></span>;
    } else if(isImageItem(props.item)) {
        innerContent = <a className={"cartoon-image-a"} href="#" onDragStart={preventDefault} onClick={preventDefault}><img onLoad={onLoadImg} onDragStart={preventDefault} src={props.item.imageURL} className="cartoon-image" draggable={false}/></a>;
    } else
        throw new Error("Unexpected item type");
    
    const [ divRef, setDivRef ] = React.useState<HTMLDivElement>(null);
    const onMouseDown = () => {
        props.onItemFocus(props.item);
    };
    const onStartVisualChange = () => {
        onMouseDown();
        if(props.item.isLocked)
            return false;
        setBeingDragged(true);
        return;
    }
    const onEndVisualChange = () => {
        setBeingDragged(false);
    }
    const onDragStart = (e) => {
        e.set([ props.item.x, props.item.y ]);
        e.datas.startTime = Date.now();
        e.datas.clientX = e.clientX;
        e.datas.clientY = e.clientY;
        return onStartVisualChange();
    };
    const onDragEnd = (e) => {
        const distance = Math.sqrt(Math.pow(e.datas.clientX - e.clientX, 2) + Math.pow(e.datas.clientY - e.clientY, 2));
        if(!e.isDrag || distance <= 6) {
            const distTime = Date.now() - e.datas.startTime;
            if (distTime >= 700) {
                handleMenu(e.inputEvent);
            }
        }
        onEndVisualChange();
    };
    const onScaleStart = ({ set, dragStart }) => {
        set([ props.item.scale, props.item.scale ]);
        dragStart && dragStart.set([ props.item.x, props.item.y ]);
        return onStartVisualChange();
    };
    const onRotateStart = ({ set }) => {
        set(props.item.rotation);
        return onStartVisualChange();
    }
    React.useEffect(() => {
        if(typeof props.getHandleMenuCb == 'function')
            props.getHandleMenuCb(handleMenu);
        return function cleanup() {
            if(typeof props.getHandleMenuCb == 'function')
                props.getHandleMenuCb(null);
        }
    });
    const refCb = (ref) => {
        setDivRef(ref);
    };
    const enterEditMode = () => {
        setEditMode(true);
    };
    const handleMenu = (event) => {
        ignoreEv(event);
        if(event.target == divRef)
            event.target.focus();
        props.onItemFocus(props.item);
        try {
            props.setMenuPosition({ x: event.pageX, y: event.pageY });
            props.setEnterEditModeCallback({fn: enterEditMode});
            props.setContextItem(props.item);
            contextMenu.show({ id: 'item-menu', event});
        } catch(e) {
            window.alert("Failed to show menu");
        }
    };
    const ignoreEv = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
    };
    const transform = `translate(${props.item.x}px, ${props.item.y}px) scale(${props.item.scale}) rotateZ(${props.item.rotation}deg)`;
    return <>
        <div onMouseDown={onMouseDown} onTouchStart={onMouseDown} onContextMenu={handleMenu} ref={refCb} style={{display: "inline-block", zIndex: props.item.zIndex,
            transform: transform }} onFocus={props.onItemFocus} onBlur={props.onItemBlur}
            className={"cartoon-real-transform" + (isTextItem(props.item) ? " cartoon-text-parent" : "") + (` cartoon-${props.item.isLocked ? "locked" : "unlocked"}`)
                + ((isTextItem(props.item) && isBeingDragged) ? " cartoon-block-select" : "") + (props.isFocused ? " cartoon-focused" : "")} draggable={false}>
            
            <div className="cartoon-transform" draggable={false} style={{transform: `scale(${props.item.flipped ? '-1' : '1'}, 1)`}}>
                {innerContent}
            </div>
        </div>
        <Suspense fallback={<CartoonLoader className="draggable-loader" style={{transform: transform}}/>}>
            <Moveable ref={moveable} target={((!isImageItem(props.item) || imageHasLoaded) && !inEditMode && !props.item.isLocked && props.isFocused) ? divRef : null}
                draggable={true} pinchable={true} origin={false} scalable={true} rotatable={true} onRotateStart={onRotateStart} onRotateEnd={onEndVisualChange}
                    onScaleStart={onScaleStart} onScaleEnd={onEndVisualChange} onDrag={onDragHandler} onDragStart={onDragStart} onDragEnd={onDragEnd}
                onRotate={onRotateHandler} onScale={onScaleHandler} keepRatio={true} throttleRotate={10}/>
        </Suspense>
    </>;
}



function ControlButton(props) {
    let { type, title, ...rest } = props;
    if(type == undefined)
        type = '';
    return <button className="hoverable-button" {...rest} title={title}><i className={`fas ${type}`}></i></button>;
}

interface CartoonSceneProps {
    scene: Scene;
    onGoBack: () => void;
    onSceneValsChange: (scene: Scene) => void;
    onChangeSceneIdx: (delta: DeltaType) => void;
    allowPrevious: boolean;
    allowNext: boolean;
}

function CartoonMenuItem(props) {
    const { type, text, onClick } = props;
    return <Item onClick={onClick}><i className={`fas ${type}`}></i>&nbsp;{text}</Item>;
}
type HandleMenu = (e: React.SyntheticEvent) => void;

function textToHtml(value: string): string {
    value = value.trim();
    value = value.replace(/\n+\s+\n+/g, '\n\n');
    value = value.replace(/\n\n+/g, '\n\n');
    value = value.replace(/\n/g, '<br>');
    value = value.replace(/\s+/g, ' ');

    return value;
}
function htmlToText(value: string): string {
    // Convert `&amp;` to `&`.
    value = value.replace(/&amp;/gi, '&');

    // Replace spaces.
    value = value.replace(/&nbsp;/gi, ' ');
    value = value.replace(/\s+/g, ' ');

    // Remove "<b>".
    value = value.replace(/<b>/gi, '');
    value = value.replace(/<\/b>/gi, '');

    // Remove "<strong>".
    value = value.replace(/<strong>/gi, '');
    value = value.replace(/<\/strong>/gi, '');

    // Remove "<i>".
    value = value.replace(/<i>/gi, '');
    value = value.replace(/<\/i>/gi, '');

    // Remove "<em>".
    value = value.replace(/<em>/gi, '');
    value = value.replace(/<\/em>/gi, '');

    // Remove "<u>".
    value = value.replace(/<u>/gi, '');
    value = value.replace(/<\/u>/gi, '');

    // Tighten up "<" and ">".
    value = value.replace(/>\s+/g, '>');
    value = value.replace(/\s+</g, '<');

    // Replace "<br>".
    value = value.replace(/<br>/gi, '\n');

    // Replace "<div>" (from Chrome).
    value = value.replace(/<div>/gi, '\n');
    value = value.replace(/<\/div>/gi, '');

    // Replace "<p>" (from IE).
    value = value.replace(/<p>/gi, '\n');
    value = value.replace(/<\/p>/gi, '');

    // No more than 2x newline, per "paragraph".
    value = value.replace(/\n\n+/g, '\n\n');

    // Whitespace before/after.
    value = value.trim();

    return value;
}


function CartoonScene(props: CartoonSceneProps) {
    const [ focusedItem, setFocusedItem ] = React.useState<SceneItem>(null);
    const [ menuRevealed, setMenuRevealed ] = React.useState(false);
    const [ isAddingImage, setAddingImage ] = React.useState(false);
    const [ isLoadingScreenshotTool, setLoadingScreenshotTool ] = React.useState(false);
    const [ isTakingScreenshot, setTakingScreenshot ] = React.useState(false);
    const [ showDownloadWindow, setShowingDownloadWindow ] = React.useState(false);
    const [ lastScreenshotTaken, setScreenshotTaken ] = React.useState(null);
    const [ screenshotsAllowed, setScreenshotsAllowed ] = React.useState(true);
    const sceneDiv = React.useRef<HTMLDivElement>(null);
    const [ contextItem, setContextItem ] = React.useState<SceneItem>(null);
    const [ enterEditModeCallbackObj, setEnterEditModeCallbackObj ] = React.useState<{ fn: () => void }>(null);
    const [ menuPosition, setMenuPosition ] = React.useState<{ x: number; y: number; }>(null);
    const handleMenusRef = React.useRef<{ [id: string]: HandleMenu; }>({});
    React.useEffect(() => {
        if(isTakingScreenshot) {
            const errFunc = function (error) {
                console.error(error);
                setTakingScreenshot(false);
                setScreenshotTaken(null);
                setShowingDownloadWindow(true);
                setScreenshotsAllowed(false);
            };
            import("dom-to-image").then((domtoimage) => {
                domtoimage.toPng(sceneDiv.current, {}).then(function (dataUrl) {
                    setScreenshotTaken(dataUrl);
                    setShowingDownloadWindow(true);
                    setTakingScreenshot(false);
                }).catch(errFunc);
            }).catch(errFunc);
        }
    }, [ isTakingScreenshot ]);
    const forceUpdate = useForceUpdate();
    const sceneStyle = {
        background: 'white'
    };
    const deleteItem = (item: SceneItem) => {
        const index = props.scene.items.indexOf(item);
        if(index == -1)
            throw new Error("Invariant violation: non-attached item.");
        props.scene.items.splice(index, 1);
        props.onSceneValsChange(props.scene);
        if(item == focusedItem) {
            setFocusedItem(null);
        }
        forceUpdate();  
    };
    const onVisualUpdate = () => {
        props.onSceneValsChange(props.scene);
    };
    const onTextChange = (item: TextSceneItem, e: React.SyntheticEvent) => {
        const text = (e.target as HTMLElement).innerHTML;
        item.text = text;
        props.onSceneValsChange(props.scene);
    };
    const onFocusItem = (item: SceneItem, handleMenu: HandleMenu, e: React.SyntheticEvent) => {
        checkTextFocusedItem();
        setFocusedItem(item);
    }
    const checkTextFocusedItem = () => {
        if(focusedItem == null)
            return;
        if(isTextItem(focusedItem)) {
            if(focusedItem.text.length == 0) {
                /* Just delete it. */
                deleteItem(focusedItem);
            }
        }
    };
    const onItemBlur = (e: React.SyntheticEvent) => {
        if(focusedItem == null)
            return;
        checkTextFocusedItem();
    }
    const doAdjustZIndexFocusedItem = (delta: number) => {
        let newZIndex = focusedItem.zIndex + delta;
        if(newZIndex < 0)
            newZIndex = 0;
        focusedItem.zIndex = newZIndex;
        props.onSceneValsChange(props.scene);
        forceUpdate();
    };
    const doDeleteFocusItem = () => {
        deleteItem(contextItem);
    };
    const doCreateNewTextualItem = () => {
        const item = createStockTextItem(shortid.generate(), menuPosition.x, menuPosition.y);
        props.scene.items.push(item);
        setFocusedItem(item);
        props.onSceneValsChange(props.scene);
        forceUpdate();
    };
    const handleImageSelect = (image: string) => {
        const item = createStockImageItem(image, shortid.generate(), menuPosition.x, menuPosition.y);
        setFocusedItem(item);
        props.scene.items.push(item);
        setAddingImage(false);
        props.onSceneValsChange(props.scene);
        forceUpdate();
    }
    const onBackgroundClick = (e: React.SyntheticEvent) => {
        if(e.target == sceneDiv.current) {
            checkTextFocusedItem();
            setFocusedItem(null);
        }
    };
    const doTakeScreenshot = () => {
        /* Prepare the DOM for taking a screenshot */
        checkTextFocusedItem();
        setFocusedItem(null);
        setLoadingScreenshotTool(true);
        import("dom-to-image").then(() => {
            setLoadingScreenshotTool(false);
            setTakingScreenshot(true);
        });
        
    };
    const doDownloadScreenshot = () => {
        setShowingDownloadWindow(false);
    };
    const onMenuInteraction = (e: React.SyntheticEvent) => {
        (e.target as HTMLElement).focus();
    };
    const doToggleLocking = (obj) => {
        contextItem.isLocked = !contextItem.isLocked;
        props.onSceneValsChange(props.scene);
        forceUpdate();
    }
    const handleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setContextItem(null);
        setEnterEditModeCallbackObj(null);
        setMenuPosition({ x: e.pageX, y: e.pageY });
        contextMenu.show({ id: 'background-menu', event: e });
    };
    const showMenuForFocusedItem = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(focusedItem == null)
            return;
        
        handleMenusRef.current[focusedItem.id](e);
    };
    const isFocusedItemLocked = () => (focusedItem != null && focusedItem.isLocked);
    const doFlipContextItem = () => {
        if(contextItem != null) {
            contextItem.flipped = !contextItem.flipped;
            props.onSceneValsChange(props.scene);
            forceUpdate();
        }
    };
    const commonMenu = <>
        <CartoonMenuItem type="fa-font" text="Add text" onClick={doCreateNewTextualItem}/>  
        <CartoonMenuItem type="fa-image" text="Add image" onClick={() => setAddingImage(true)}/>
        {screenshotsAllowed ? <CartoonMenuItem type="fa-camera" text="Take screenshot" onClick={doTakeScreenshot}/> : null}
    </>;
    const getDivRef = (id: string, divRef: HandleMenu) => {
        handleMenusRef.current[id] = divRef;
    };
    const [ categoryIndex, setCategoryIndex ] = React.useState(0);
    const [ currentImageIndex, setImageIndex ] = React.useState(0);
    if(!isLoadingScreenshotTool)
        return <>
            <Menu id='item-menu'>
                {function() {
                    if(contextItem != null && !contextItem.isLocked && contextItem.type == 'text')
                        return <CartoonMenuItem type="fa-edit" text="Edit text" onClick={enterEditModeCallbackObj.fn}/>;
                    else
                        return null;
                }()}
                {contextItem != null && !contextItem.isLocked && contextItem.type == 'image' && <CartoonMenuItem type="fa-sync-alt" text="Flip item" onClick={doFlipContextItem}/>}
                {contextItem != null && !contextItem.isLocked && <CartoonMenuItem type="fa-trash" text="Delete item" onClick={doDeleteFocusItem}/>}
                <CartoonMenuItem type={isFocusedItemLocked() ? "fa-lock-open" : "fa-lock"} text={isFocusedItemLocked() ? "Unlock" : "Lock"} onClick={doToggleLocking}/>
                {contextItem != null && !contextItem.isLocked && <CartoonMenuItem type="fa-chevron-up" text="Raise item" onClick={doAdjustZIndexFocusedItem.bind(this, 1)}/>}
                {contextItem != null && !contextItem.isLocked && <CartoonMenuItem type="fa-chevron-down" text="Lower item" onClick={doAdjustZIndexFocusedItem.bind(this, -1)}/>}
                <Separator />
                {commonMenu}
            </Menu>
            <Menu id='background-menu'>
                {commonMenu}
            </Menu>
            <div className="cartoon-contents">
                <div className="cartoon-items" ref={sceneDiv} style={sceneStyle} onMouseDown={onBackgroundClick} onContextMenu={handleMenu}>
                    {props.scene.items.map((item) => <CartoonSceneItem getHandleMenuCb={getDivRef.bind(this, item.id)} setMenuPosition={setMenuPosition}
                        setContextItem={setContextItem} setEnterEditModeCallback={setEnterEditModeCallbackObj} isFocused={item == focusedItem}
                        onVisualUpdate={onVisualUpdate} onItemFocus={onFocusItem.bind(this, item)} onItemBlur={onItemBlur}
                        onTextInput={onTextChange.bind(this, item)} item={item} key={item.id}/>)}
            
                    {isTakingScreenshot ? null: 
                    <div className={`cartoon-controls cartoon-controls-${menuRevealed ? "revealed" : "unrevealed"}`} onScroll={onMenuInteraction} onTouchStart={onMenuInteraction}>
                        <bdo dir="ltr">
                            {focusedItem != null && <ControlButton type="fa-bars" title={`${menuRevealed ? "Hide" : "Show"} menu`} onClick={showMenuForFocusedItem}/>}
                            <ControlButton type="fa-chevron-up" title="Choose a new scene" onClick={() => props.onChangeSceneIdx('menu')}/>
                            <ControlButton type="fa-chevron-left" title="Previous scene" onClick={() => props.onChangeSceneIdx(-1)} disabled={props.allowPrevious ? null : true}/>
                            <ControlButton type="fa-chevron-right" title="Next scene" onClick={() => props.onChangeSceneIdx(1)} disabled={props.allowNext ? null: true}/>
                        </bdo>
                    </div>}
                </div>
            </div>
            <Modal isOpen={isAddingImage}>
                <ImageSelector setCategoryIndex={setCategoryIndex} categoryIndex={categoryIndex}
                    setImageIndex={setImageIndex} currentImageIndex={currentImageIndex}
                    onImageSelected={handleImageSelect} onCancel={() => setAddingImage(false)}/>
            </Modal>
            <Modal isOpen={showDownloadWindow}>
                {lastScreenshotTaken != null ? <a href={lastScreenshotTaken} target="_blank" onClick={doDownloadScreenshot} onContextMenu={(e) => e.preventDefault()}
                    download="cartoon.png">Download your cartoon here.</a> :
                "Your browser failed to take a screenshot for some reason. You'll have to use the screenshot tool provided on your device."}
                <p style={{marginBottom: '0'}}><button className="scene-card-button hoverable-button" onClick={() => setShowingDownloadWindow(false)}>{lastScreenshotTaken != null ? "Cancel" : "OK"}</button></p>
            </Modal>
        </>;
    else
        return <FullscreenCartoonLoader/>;
}

import(/* webpackPrefetch: true */ "react-moveable");
type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: (() => number);
};

declare global {
  interface Window {
    requestIdleCallback: ((
      callback: ((deadline: RequestIdleCallbackDeadline) => void),
      opts?: RequestIdleCallbackOptions,
    ) => RequestIdleCallbackHandle);
    cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
  }
}

export default function CartoonScreen(props: CartoonSceneProps) {
    return <div className="cartoon-screen">
        <CartoonScene {...props}/>
    </div>;
}