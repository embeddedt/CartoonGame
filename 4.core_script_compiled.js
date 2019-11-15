(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{26:function(e,t,n){"use strict";n.r(t);var a=n(1),o=n(0),i=n.n(o),r=n(5),c=n(9),l=n.n(c),s=n(28),u=n.n(s);var d=n(7),m=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.state={canRender:!1},t.container={},t}return Object(a.c)(t,e),t.prototype.componentDidMount=function(){this.container=document.createElement("div"),document.body.appendChild(this.container),this.setState({canRender:!0})},t.prototype.componentWillUnmount=function(){document.body.removeChild(this.container)},t.prototype.render=function(){return this.state.canRender&&Object(d.createPortal)(this.props.children,this.container)},t}(o.PureComponent),f=0,p=function(e){return"DISPLAY_"+e},h="react-contexify",g="react-contexify__separator",v="react-contexify__item",b="react-contexify__item--disabled",E="react-contexify__item__content",y="react-contexify__theme--",w="react-contexify__will-enter--",x={eventList:new Map,on:function(e,t){var n=this;return this.eventList.has(e)||this.eventList.set(e,new Set),this.eventList.get(e).add(t),function(){return n.eventList.get(e).delete(t)}},emit:function(e){for(var t=this,n=[],o=1;o<arguments.length;o++)n[o-1]=arguments[o];return this.eventList.has(e)?(this.eventList.get(e).forEach((function(e){return e.call.apply(e,Object(a.g)([t],n))})),!0):(console.warn("<"+e+"> Event is not registered. Did you forgot to bind the event ?"),!1)}},k={ENTER:13,ESC:27,ARROW_UP:38,ARROW_DOWN:40,ARROW_LEFT:37,ARROW_RIGHT:39},C=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.state={x:0,y:0,visible:!1,nativeEvent:{},propsFromTrigger:{},onShown:null,onHidden:null},t.unsub=[],t.bindWindowEvent=function(){window.addEventListener("resize",t.hide),window.addEventListener("contextmenu",t.hide),window.addEventListener("mousedown",t.hide),window.addEventListener("click",t.hide),window.addEventListener("scroll",t.hide),window.addEventListener("keydown",t.handleKeyboard)},t.unBindWindowEvent=function(){window.removeEventListener("resize",t.hide),window.removeEventListener("contextmenu",t.hide),window.removeEventListener("mousedown",t.hide),window.removeEventListener("click",t.hide),window.removeEventListener("scroll",t.hide),window.removeEventListener("keydown",t.handleKeyboard)},t.onMouseEnter=function(){return window.removeEventListener("mousedown",t.hide)},t.onMouseLeave=function(){return window.addEventListener("mousedown",t.hide)},t.hide=function(e){var n=e;(void 0===n||2!==n.button&&!0!==n.ctrlKey||"contextmenu"===n.type)&&(t.unBindWindowEvent(),t.setState({visible:!1}))},t.handleKeyboard=function(e){e.keyCode!==k.ENTER&&e.keyCode!==k.ESC||(t.unBindWindowEvent(),t.setState({visible:!1}))},t.setRef=function(e){t.menuRef=e},t.show=function(e,n){e.stopPropagation(),x.emit(f);var a=t.getMousePosition(e),o=a.x,i=a.y;t.setState({visible:!0,x:o,y:i,nativeEvent:e,propsFromTrigger:n},t.setMenuPosition)},t}return Object(a.c)(t,e),t.prototype.componentDidMount=function(){this.unsub.push(x.on(p(this.props.id),this.show)),this.unsub.push(x.on(f,this.hide))},t.prototype.componentWillUnmount=function(){this.unsub.forEach((function(e){return e()})),this.unBindWindowEvent()},t.prototype.componentDidUpdate=function(e,t){this.state.visible!==t.visible&&(this.state.visible&&this.props.onShown?this.props.onShown():!this.state.visible&&this.props.onHidden&&this.props.onHidden())},t.prototype.setMenuPosition=function(){var e=window.innerWidth,t=window.innerHeight,n=this.menuRef,a=n.offsetWidth,o=n.offsetHeight,i=this.state,r=i.x,c=i.y;r+a>e&&(r-=r+a-e),c+o>t&&(c-=c+o-t),this.setState({x:r,y:c},this.bindWindowEvent)},t.prototype.getMousePosition=function(e){var t={x:e.clientX,y:e.clientY};return"touchend"===e.type&&(!t.x||!t.y)&&e.changedTouches&&e.changedTouches.length>0&&(t.x=e.changedTouches[0].clientX,t.y=e.changedTouches[0].clientY),(!t.x||t.x<0)&&(t.x=0),(!t.y||t.y<0)&&(t.y=0),t},t.prototype.render=function(){var e,t=this.props,n=t.theme,r=t.animation,c=t.style,l=t.className,s=t.children,d=this.state,f=d.visible,p=d.nativeEvent,g=d.propsFromTrigger,v=d.x,b=d.y,E=u()(h,l,((e={})[y+n]=n,e[w+r]=r,e)),x=Object(a.a)(Object(a.a)({},c),{left:v,top:b+1,opacity:1});return i.a.createElement(m,null,f&&i.a.createElement("div",{className:E,style:x,ref:this.setRef,onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave},i.a.createElement("div",null,function(e,t){return o.Children.map(o.Children.toArray(e).filter((function(e){return Boolean(e)})),(function(e){return Object(o.cloneElement)(e,t)}))}(s,{nativeEvent:p,propsFromTrigger:g}))))},t.propTypes={id:l.a.oneOfType([l.a.string,l.a.number]).isRequired,children:l.a.node.isRequired,theme:l.a.string,animation:l.a.string,className:l.a.string,style:l.a.object},t}(o.Component),S=function(){},O=function(e){function t(t){var n=e.call(this,t)||this;n.handleClick=function(e){n.isDisabled?e.stopPropagation():n.props.onClick({event:n.props.nativeEvent,props:Object(a.a)(Object(a.a)({},n.props.propsFromTrigger),n.props.data)})};var o=n.props,i=o.disabled,r=o.nativeEvent,c=o.propsFromTrigger,l=o.data;return n.isDisabled="function"==typeof i?i({event:r,props:Object(a.a)(Object(a.a)({},c),l)}):i,n}return Object(a.c)(t,e),t.prototype.render=function(){var e,t=this.props,n=t.className,a=t.style,o=t.children,r=u()(v,n,((e={})[""+b]=this.isDisabled,e));return i.a.createElement("div",{className:r,style:a,onClick:this.handleClick,role:"presentation"},i.a.createElement("div",{className:E},o))},t.propTypes={children:l.a.node.isRequired,data:l.a.object,disabled:l.a.oneOfType([l.a.func,l.a.bool]),onClick:l.a.func,nativeEvent:l.a.object,propsFromTrigger:l.a.object,className:l.a.string,style:l.a.object},t.defaultProps={disabled:!1,onClick:S},t}(o.Component),j=function(){return i.a.createElement("div",{className:g})},L={show:function(e){var t=e.id,n=e.event,a=e.props;x.emit(p(t),n.nativeEvent||n,a)},hideAll:function(){x.emit(f)}},I=n(25);function N(e,t,n){void 0===n&&(n=1);for(var a=[],o=n;o<=t;o++)a.push(e(o));return a}var R={"Speech bubbles":N((function(e){return"images/png/bubble"+e+".png"}),9),Birds:N((function(e){return"images/png/bird"+e+".png"}),8),People:N((function(e){return"images/png/boy"+e+".png"}),4).concat(["images/png/girl.png","images/png/father.png"]),Animals:["images/png/cat.png","images/png/dog.png","images/png/dog2.png"],City:["images/png/city.jpg","images/png/city2.jpg","images/png/city3.jpg"]},M=Object.keys(R),T=Object(I.unstable_createResource)((function(e){return new Promise((function(t){var n=new XMLHttpRequest;n.open("get",e),n.responseType="blob",n.onload=function(){var e=new FileReader;e.onload=function(){t(this.result)},e.readAsDataURL(n.response)},n.send()}))})),D=function(e){var t=e.src,n=e.alt,o=Object(a.f)(e,["src","alt"]),r=T.read(t);return i.a.createElement("img",Object(a.a)({src:r,alt:n},o))};function F(e){var t=e.src;return i.a.createElement(D,{className:"selectable-image",src:t,alt:"image",onClick:e.onImageSelected})}function P(e){return i.a.createElement(F,{src:e.image,onImageSelected:e.onImageSelected})}function _(e){var t=e.type,n=Object(a.f)(e,["type"]);return i.a.createElement("button",Object(a.a)({className:"scene-card-button hoverable-button"},n),i.a.createElement("i",{className:"fas fa-"+t}))}function W(e){var t=e.categoryIndex,n=e.setCategoryIndex,a=e.currentImageIndex,c=e.setImageIndex;i.a.useEffect((function(){c(0)}),[t]);var l=M[t];return i.a.createElement("div",{className:"rm-padding"},i.a.createElement("span",{className:"image-selector-category"},i.a.createElement(_,{type:"chevron-left",disabled:!(t>0)||null,onClick:function(){return n(t-1)}}),i.a.createElement("span",{style:{fontSize:"1.5em",fontWeight:"bold"}},l),i.a.createElement(_,{type:"chevron-right",disabled:!(t<M.length-1)||null,onClick:function(){return n(t+1)}})),i.a.createElement("p",null),i.a.createElement("b",null,"Choice ",a+1," of ",R[l].length,":"),i.a.createElement("br",null),i.a.createElement("span",{className:"image-selector-span"},i.a.createElement(_,{type:"chevron-left",disabled:!(a>0)||null,onClick:function(){return c(a-1)}}),i.a.createElement("div",{className:"new-selector-wrapper"},i.a.createElement(o.Suspense,{fallback:i.a.createElement(r.a,null)},i.a.createElement(P,{key:a,image:R[l][a],onImageSelected:e.onImageSelected.bind(this,R[l][a])}))),i.a.createElement(_,{type:"chevron-right",disabled:!(a<R[l].length-1)||null,onClick:function(){return c(a+1)}})),i.a.createElement("p",null),i.a.createElement("button",{className:"scene-card-button hoverable-button",onClick:e.onCancel},"Cancel"))}var H=n(4),A=n.n(H),U=n(3);n.d(t,"default",(function(){return J}));var V=i.a.lazy((function(){return n.e(2).then(n.bind(null,40))}));function B(e){return"text"==e.type}function Y(e){return"image"==e.type}i.a.lazy((function(){return new Promise((function(e,t){}))}));function z(e){var t,n=function(e){return e.preventDefault()},c=Object(r.e)(),l=Object(a.e)(i.a.useState(!1),2),s=l[0],u=l[1],d=i.a.useRef(null),m=Object(a.e)(i.a.useState(!1),2),f=m[0],p=m[1],h=Object(a.e)(i.a.useState(!1),2),g=h[0],v=h[1],b=function(t){e.item.isLocked&&(t.target.focus(),e.onItemFocus(e.item))},E=i.a.useRef(null);i.a.useEffect((function(){f&&E.current.focus()}),[f]);if(B(e.item))t=i.a.createElement("span",{onBlur:function(){f&&p(!1)},ref:E,spellCheck:!1,onMouseDown:b,onDoubleClick:function(){!e.isFocused||e.item.isLocked||f||s||p(!0)},onTouchStart:b,contentEditable:!e.item.isLocked&&f,suppressContentEditableWarning:!0,className:"cartoon-textbox"+(f?" cartoon-text-edit-mode":""),onInput:function(t){"function"==typeof e.onTextInput&&e.onTextInput(t),s||d.current.updateRect()},dangerouslySetInnerHTML:{__html:e.item.text}});else{if(!Y(e.item))throw new Error("Unexpected item type");t=i.a.createElement("a",{className:"cartoon-image-a",href:"#",onDragStart:n,onClick:n},i.a.createElement("img",{onLoad:function(){v(!0)},onDragStart:n,src:e.item.imageURL,className:"cartoon-image",draggable:!1}))}var y=Object(a.e)(i.a.useState(null),2),w=y[0],x=y[1],k=function(){e.onItemFocus(e.item)},C=function(){if(k(),e.item.isLocked)return!1;u(!0)},S=function(){u(!1)};i.a.useEffect((function(){return"function"==typeof e.getHandleMenuCb&&e.getHandleMenuCb(j),function(){"function"==typeof e.getHandleMenuCb&&e.getHandleMenuCb(null)}}));var O=function(){p(!0)},j=function(t){I(t),t.target==w&&t.target.focus(),e.onItemFocus(e.item);try{e.setMenuPosition({x:t.pageX,y:t.pageY}),e.setEnterEditModeCallback({fn:O}),e.setContextItem(e.item),L.show({id:"item-menu",event:t})}catch(e){window.alert("Failed to show menu")}},I=function(e){e.preventDefault(),e.stopPropagation()},N="translate("+e.item.x+"px, "+e.item.y+"px) scale("+e.item.scale+") rotateZ("+e.item.rotation+"deg)";return i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{onMouseDown:k,onTouchStart:k,onContextMenu:j,ref:function(e){x(e)},style:{display:"inline-block",zIndex:e.item.zIndex,transform:N},onFocus:e.onItemFocus,onBlur:e.onItemBlur,className:"cartoon-real-transform"+(B(e.item)?" cartoon-text-parent":"")+" cartoon-"+(e.item.isLocked?"locked":"unlocked")+(B(e.item)&&s?" cartoon-block-select":"")+(e.isFocused?" cartoon-focused":""),draggable:!1},i.a.createElement("div",{className:"cartoon-transform",draggable:!1,style:{transform:"scale("+(e.item.flipped?"-1":"1")+", 1)"}},t)),i.a.createElement(o.Suspense,{fallback:i.a.createElement(r.a,{className:"draggable-loader",style:{transform:N}})},i.a.createElement(V,{ref:d,target:Y(e.item)&&!g||f||e.item.isLocked||!e.isFocused?null:w,draggable:!0,pinchable:!0,origin:!1,scalable:!0,rotatable:!0,onRotateStart:function(t){return(0,t.set)(e.item.rotation),C()},onRotateEnd:S,onScaleStart:function(t){var n=t.set,a=t.dragStart;return n([e.item.scale,e.item.scale]),a&&a.set([e.item.x,e.item.y]),C()},onScaleEnd:S,onDrag:function(t){e.item.x=t.beforeTranslate[0],e.item.y=t.beforeTranslate[1],e.onVisualUpdate(),c()},onDragStart:function(t){return t.set([e.item.x,e.item.y]),t.datas.startTime=Date.now(),t.datas.clientX=t.clientX,t.datas.clientY=t.clientY,C()},onDragEnd:function(e){var t=Math.sqrt(Math.pow(e.datas.clientX-e.clientX,2)+Math.pow(e.datas.clientY-e.clientY,2));(!e.isDrag||t<=6)&&(Date.now()-e.datas.startTime>=700&&j(e.inputEvent));S()},onRotate:function(t){t.target;var n=t.beforeRotate;e.item.rotation=n,e.onVisualUpdate(),c()},onScale:function(t){e.item.scale*=t.delta[0],e.item.x+=t.drag.beforeDelta[0],e.item.y+=t.drag.beforeDelta[1],e.onVisualUpdate(),c()},keepRatio:!0,throttleRotate:10})))}function X(e){var t=e.type,n=e.title,o=Object(a.f)(e,["type","title"]);return null==t&&(t=""),i.a.createElement("button",Object(a.a)({className:"hoverable-button"},o,{title:n}),i.a.createElement("i",{className:"fas "+t}))}function q(e){var t=e.type,n=e.text,a=e.onClick;return i.a.createElement(O,{onClick:a},i.a.createElement("i",{className:"fas "+t})," ",n)}function K(e){var t=this,o=Object(a.e)(i.a.useState(null),2),c=o[0],l=o[1],s=Object(a.e)(i.a.useState(!1),2),u=s[0],d=(s[1],Object(a.e)(i.a.useState(!1),2)),m=d[0],f=d[1],p=Object(a.e)(i.a.useState(!1),2),h=p[0],g=p[1],v=Object(a.e)(i.a.useState(!1),2),b=v[0],E=v[1],y=Object(a.e)(i.a.useState(!1),2),w=y[0],x=y[1],k=Object(a.e)(i.a.useState(null),2),S=k[0],O=k[1],I=Object(a.e)(i.a.useState(!0),2),N=I[0],R=I[1],M=i.a.useRef(null),T=Object(a.e)(i.a.useState(null),2),D=T[0],F=T[1],P=Object(a.e)(i.a.useState(null),2),_=P[0],H=P[1],V=Object(a.e)(i.a.useState(null),2),Y=V[0],K=V[1],J=i.a.useRef({});i.a.useEffect((function(){if(b){var e=function(e){console.error(e),E(!1),O(null),x(!0),R(!1)};n.e(1).then(n.t.bind(null,39,7)).then((function(t){t.toPng(M.current,{}).then((function(e){O(e),x(!0),E(!1)})).catch(e)})).catch(e)}}),[b]);var G=Object(r.e)(),Z=function(t){var n=e.scene.items.indexOf(t);if(-1==n)throw new Error("Invariant violation: non-attached item.");e.scene.items.splice(n,1),e.onSceneValsChange(e.scene),t==c&&l(null),G()},Q=function(){e.onSceneValsChange(e.scene)},$=function(t,n){var a=n.target.innerHTML;t.text=a,e.onSceneValsChange(e.scene)},ee=function(e,t,n){te(),l(e)},te=function(){null!=c&&B(c)&&0==c.text.length&&Z(c)},ne=function(e){null!=c&&te()},ae=function(t){var n=c.zIndex+t;n<0&&(n=0),c.zIndex=n,e.onSceneValsChange(e.scene),G()},oe=function(e){e.target.focus()},ie=function(){return null!=c&&c.isLocked},re=i.a.createElement(i.a.Fragment,null,i.a.createElement(q,{type:"fa-font",text:"Add text",onClick:function(){var t=Object(r.d)(A.a.generate(),Y.x,Y.y);e.scene.items.push(t),l(t),e.onSceneValsChange(e.scene),G()}}),i.a.createElement(q,{type:"fa-image",text:"Add image",onClick:function(){return f(!0)}}),N?i.a.createElement(q,{type:"fa-camera",text:"Take screenshot",onClick:function(){te(),l(null),g(!0),n.e(1).then(n.t.bind(null,39,7)).then((function(){g(!1),E(!0)}))}}):null),ce=function(e,t){J.current[e]=t},le=Object(a.e)(i.a.useState(0),2),se=le[0],ue=le[1],de=Object(a.e)(i.a.useState(0),2),me=de[0],fe=de[1];return h?i.a.createElement(r.b,null):i.a.createElement(i.a.Fragment,null,i.a.createElement(C,{id:"item-menu"},null==D||D.isLocked||"text"!=D.type?null:i.a.createElement(q,{type:"fa-edit",text:"Edit text",onClick:_.fn}),null!=D&&!D.isLocked&&"image"==D.type&&i.a.createElement(q,{type:"fa-sync-alt",text:"Flip item",onClick:function(){null!=D&&(D.flipped=!D.flipped,e.onSceneValsChange(e.scene),G())}}),null!=D&&!D.isLocked&&i.a.createElement(q,{type:"fa-trash",text:"Delete item",onClick:function(){Z(D)}}),i.a.createElement(q,{type:ie()?"fa-lock-open":"fa-lock",text:ie()?"Unlock":"Lock",onClick:function(t){D.isLocked=!D.isLocked,e.onSceneValsChange(e.scene),G()}}),null!=D&&!D.isLocked&&i.a.createElement(q,{type:"fa-chevron-up",text:"Raise item",onClick:ae.bind(this,1)}),null!=D&&!D.isLocked&&i.a.createElement(q,{type:"fa-chevron-down",text:"Lower item",onClick:ae.bind(this,-1)}),i.a.createElement(j,null),re),i.a.createElement(C,{id:"background-menu"},re),i.a.createElement("div",{className:"cartoon-contents"},i.a.createElement("div",{className:"cartoon-items",ref:M,style:{background:"white"},onMouseDown:function(e){e.target==M.current&&(te(),l(null))},onContextMenu:function(e){e.preventDefault(),e.stopPropagation(),F(null),H(null),K({x:e.pageX,y:e.pageY}),L.show({id:"background-menu",event:e})}},e.scene.items.map((function(e){return i.a.createElement(z,{getHandleMenuCb:ce.bind(t,e.id),setMenuPosition:K,setContextItem:F,setEnterEditModeCallback:H,isFocused:e==c,onVisualUpdate:Q,onItemFocus:ee.bind(t,e),onItemBlur:ne,onTextInput:$.bind(t,e),item:e,key:e.id})})),b?null:i.a.createElement("div",{className:"cartoon-controls cartoon-controls-"+(u?"revealed":"unrevealed"),onScroll:oe,onTouchStart:oe},i.a.createElement("bdo",{dir:"ltr"},null!=c&&i.a.createElement(X,{type:"fa-bars",title:(u?"Hide":"Show")+" menu",onClick:function(e){e.preventDefault(),e.stopPropagation(),null!=c&&J.current[c.id](e)}}),i.a.createElement(X,{type:"fa-chevron-up",title:"Choose a new scene",onClick:function(){return e.onChangeSceneIdx("menu")}}),i.a.createElement(X,{type:"fa-chevron-left",title:"Previous scene",onClick:function(){return e.onChangeSceneIdx(-1)},disabled:!e.allowPrevious||null}),i.a.createElement(X,{type:"fa-chevron-right",title:"Next scene",onClick:function(){return e.onChangeSceneIdx(1)},disabled:!e.allowNext||null}))))),i.a.createElement(U.a,{isOpen:m,className:"rm-content"},i.a.createElement(W,{setCategoryIndex:ue,categoryIndex:se,setImageIndex:fe,currentImageIndex:me,onImageSelected:function(t){var n=Object(r.c)(t,A.a.generate(),Y.x,Y.y);l(n),e.scene.items.push(n),f(!1),e.onSceneValsChange(e.scene),G()},onCancel:function(){return f(!1)}})),i.a.createElement(U.a,{isOpen:w,className:"rm-content"},i.a.createElement("div",{className:"rm-padding"},null!=S?i.a.createElement("a",{href:S,target:"_blank",onClick:function(){x(!1)},onContextMenu:function(e){return e.preventDefault()},download:"cartoon.png"},"Download your cartoon here."):"Your browser failed to take a screenshot for some reason. You'll have to use the screenshot tool provided on your device.",i.a.createElement("p",{style:{marginBottom:"0"}},i.a.createElement("button",{className:"scene-card-button hoverable-button",onClick:function(){return x(!1)}},null!=S?"Cancel":"OK")))))}function J(e){return i.a.createElement("div",{className:"cartoon-screen"},i.a.createElement(K,Object(a.a)({},e)))}n.e(2).then(n.bind(null,40))},28:function(e,t,n){var a;
/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/!function(){"use strict";var n={}.hasOwnProperty;function o(){for(var e=[],t=0;t<arguments.length;t++){var a=arguments[t];if(a){var i=typeof a;if("string"===i||"number"===i)e.push(a);else if(Array.isArray(a)&&a.length){var r=o.apply(null,a);r&&e.push(r)}else if("object"===i)for(var c in a)n.call(a,c)&&a[c]&&e.push(c)}}return e.join(" ")}e.exports?(o.default=o,e.exports=o):void 0===(a=function(){return o}.apply(t,[]))||(e.exports=a)}()}},0,[2]]);