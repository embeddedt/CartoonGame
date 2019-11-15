import React, { Suspense, lazy } from 'react';

const RealModal = lazy(() => {
    const p = import('react-modal');
    p.then((Modal) => Modal.default.setAppElement('#game-container'));
    return p;
});

function FakeOverlay(props) {
    return <div className="hugeflex-center" style={{
        backgroundColor: 'rgba(128, 128, 128, 0.5)'
    }}></div>;
}

import(/* webpackPrefetch: true */ 'react-modal');

export default function Modal(props) {
    if(!props.isOpen)
        return null;
    let { appElement, parentSelector, ...rest} = props;
    if(appElement == undefined || appElement == null)
        appElement = document.getElementById('#game-container');
    parentSelector = () => document.body;
    return <Suspense fallback={<FakeOverlay/>}>
        <RealModal appElement={appElement} parentSelector={parentSelector} {...rest}>
            {props.children}
        </RealModal>
    </Suspense>;
}