import { unstable_createResource } from 'react-cache';
import React, { Suspense } from 'react';
import { CartoonLoader } from './types';

function genRepeatedArray<T>(templateFn: (i: number) => T, num: number, start: number = 1): T[] {
    var array = [];
    for(var i = start; i <= num; i++)
        array.push(templateFn(i));
    return array;
}

const availableImages: { [ categoryName: string]: string[]; } = {
    "Speech bubbles": genRepeatedArray(i => `images/png/bubble${i}.png`, 9),
    "Birds": genRepeatedArray(i => `images/png/bird${i}.png`, 8),
    "People": genRepeatedArray(i => `images/png/boy${i}.png`, 4).concat([ 'images/png/girl.png', 'images/png/father.png']),
    "Animals": [
        'images/png/cat.png',
        'images/png/dog.png',
        'images/png/dog2.png'
    ],
    "City": [
        'images/png/city.jpg',
        'images/png/city2.jpg',
        'images/png/city3.jpg'
    ]
};
const availableImagesKeys = Object.keys(availableImages);

const ImageResource = unstable_createResource<string, string>((source: string) => new Promise(resolve => {
    var xhr = new XMLHttpRequest();
    xhr.open('get', source);
    xhr.responseType = 'blob';
    xhr.onload = function(){
        var fr = new FileReader();

        fr.onload = function(){
            resolve(this.result as string);
        };

        fr.readAsDataURL(xhr.response); // async call
    };
    xhr.send();
}));
    
/*  We create a new img component, that will read and display
    the full resolution picture from the cache, once it gets loaded */
const Img = ({ src, alt, ...props }) => {
    const source = ImageResource.read(src);
    return <img src={source} alt={alt} {...props} />
}

function LoadedImage(props) {
    const { src } = props;
    return <Img className="selectable-image" src={src} alt="image" onClick={props.onImageSelected}/>;
}
function SelectableImage(props) {
    return <LoadedImage src={props.image} onImageSelected={props.onImageSelected}/>;
}

function Button(props) {
    const { type, ...rest } = props;
    return <button className="scene-card-button hoverable-button" {...rest}><i className={`fas fa-${type}`}></i></button>;
}

export default function ImageSelector(props) {
    const { categoryIndex, setCategoryIndex, currentImageIndex, setImageIndex } = props;
    React.useEffect(() => {
        setImageIndex(0);
    }, [ categoryIndex ]);
    const keyName = availableImagesKeys[categoryIndex];
    return <div className="rm-padding">
        <span className="image-selector-category">
            <Button type="chevron-left" disabled={categoryIndex > 0 ? null : true} onClick={() => setCategoryIndex(categoryIndex - 1)}/>
            <span style={{fontSize: '1.5em', fontWeight: 'bold'}}>{keyName}</span>
            <Button type="chevron-right" disabled={(categoryIndex < (availableImagesKeys.length - 1)) ? null : true} onClick={() => setCategoryIndex(categoryIndex + 1)}/>
        </span>
        <p></p>
        <b>Choice {currentImageIndex+1} of {availableImages[keyName].length}:</b>
        <br/>
        <span className="image-selector-span">
            <Button type="chevron-left" disabled={currentImageIndex > 0 ? null : true} onClick={() => setImageIndex(currentImageIndex - 1)}/>
            <div className="new-selector-wrapper">
                <Suspense fallback={<CartoonLoader/>}>
                    <SelectableImage key={currentImageIndex} image={availableImages[keyName][currentImageIndex]} onImageSelected={props.onImageSelected.bind(this, availableImages[keyName][currentImageIndex])}/>
                </Suspense>
            </div>
            <Button type="chevron-right" disabled={(currentImageIndex < (availableImages[keyName].length - 1)) ? null : true} onClick={() => setImageIndex(currentImageIndex + 1)}/>
        </span>
        <p></p>
        <button className="scene-card-button hoverable-button" onClick={props.onCancel}>Cancel</button>
    </div>;
}
