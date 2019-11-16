import React, { lazy } from 'react';

const RealModal = lazy(() => {
    const p = import('react-modal');
    p.then((Modal) => Modal.default.setAppElement('#game-container'));
    return p;
});

export default function Modal(props) {
    if(!props.isOpen)
        return null;
    let { appElement, parentSelector, className, ...rest} = props;
    if(appElement == undefined || appElement == null)
        appElement = document.getElementById('#game-container');
    if(!className)
        className = "";
    className = "rm-content " + className;
    parentSelector = () => document.body;
    return <RealModal appElement={appElement} parentSelector={parentSelector} className={className} {...rest}>
        <div className="rm-padding">
            {props.children}
        </div>
    </RealModal>;
}