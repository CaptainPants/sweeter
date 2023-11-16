export interface IntrinsicElementTypeMap {
    a: HTMLAnchorElement;
    abbr: HTMLElement;
    address: HTMLElement;
    area: HTMLAreaElement;
    article: HTMLElement;
    aside: HTMLElement;
    audio: HTMLAudioElement;
    b: HTMLElement;
    base: HTMLBaseElement;
    bdi: HTMLElement;
    bdo: HTMLElement;
    blockquote: HTMLQuoteElement;
    body: HTMLBodyElement;
    br: HTMLBRElement;
    button: HTMLButtonElement;
    canvas: HTMLCanvasElement;
    caption: HTMLTableCaptionElement;
    cite: HTMLElement;
    code: HTMLElement;
    col: HTMLTableColElement;
    colgroup: HTMLTableColElement;
    data: HTMLDataElement;
    datalist: HTMLDataListElement;
    dd: HTMLElement;
    del: HTMLModElement;
    details: HTMLDetailsElement;
    dfn: HTMLElement;
    dialog: HTMLDialogElement;
    div: HTMLDivElement;
    dl: HTMLDListElement;
    dt: HTMLElement;
    em: HTMLElement;
    embed: HTMLEmbedElement;
    fieldset: HTMLFieldSetElement;
    figcaption: HTMLElement;
    figure: HTMLElement;
    footer: HTMLElement;
    form: HTMLFormElement;
    h1: HTMLHeadingElement;
    h2: HTMLHeadingElement;
    h3: HTMLHeadingElement;
    h4: HTMLHeadingElement;
    h5: HTMLHeadingElement;
    h6: HTMLHeadingElement;
    head: HTMLHeadElement;
    header: HTMLElement;
    hgroup: HTMLElement;
    hr: HTMLHRElement;
    html: HTMLHtmlElement;
    i: HTMLElement;
    iframe: HTMLIFrameElement;
    img: HTMLImageElement;
    input: HTMLInputElement;
    ins: HTMLModElement;
    kbd: HTMLElement;
    label: HTMLLabelElement;
    legend: HTMLLegendElement;
    li: HTMLLIElement;
    link: HTMLLinkElement;
    main: HTMLElement;
    map: HTMLMapElement;
    mark: HTMLElement;
    menu: HTMLMenuElement;
    meta: HTMLMetaElement;
    meter: HTMLMeterElement;
    nav: HTMLElement;
    noscript: HTMLElement;
    object: HTMLObjectElement;
    ol: HTMLOListElement;
    optgroup: HTMLOptGroupElement;
    option: HTMLOptionElement;
    output: HTMLOutputElement;
    p: HTMLParagraphElement;
    picture: HTMLPictureElement;
    pre: HTMLPreElement;
    progress: HTMLProgressElement;
    q: HTMLQuoteElement;
    rp: HTMLElement;
    rt: HTMLElement;
    ruby: HTMLElement;
    s: HTMLElement;
    samp: HTMLElement;
    script: HTMLScriptElement;
    search: HTMLElement;
    section: HTMLElement;
    select: HTMLSelectElement;
    slot: HTMLSlotElement;
    small: HTMLElement;
    source: HTMLSourceElement;
    span: HTMLSpanElement;
    strong: HTMLElement;
    style: HTMLStyleElement;
    sub: HTMLElement;
    summary: HTMLElement;
    sup: HTMLElement;
    table: HTMLTableElement;
    tbody: HTMLTableSectionElement;
    td: HTMLTableCellElement;
    template: HTMLTemplateElement;
    textarea: HTMLTextAreaElement;
    tfoot: HTMLTableSectionElement;
    th: HTMLTableCellElement;
    thead: HTMLTableSectionElement;
    time: HTMLTimeElement;
    title: HTMLTitleElement;
    tr: HTMLTableRowElement;
    track: HTMLTrackElement;
    u: HTMLElement;
    ul: HTMLUListElement;
    var: HTMLElement;
    video: HTMLVideoElement;
    wbr: HTMLElement;

    'svg:a': SVGAElement;
    'svg:animate': SVGAnimateElement;
    'svg:animateMotion': SVGAnimateMotionElement;
    'svg:animateTransform': SVGAnimateTransformElement;
    'svg:circle': SVGCircleElement;
    'svg:clipPath': SVGClipPathElement;
    'svg:defs': SVGDefsElement;
    'svg:desc': SVGDescElement;
    'svg:ellipse': SVGEllipseElement;
    'svg:feBlend': SVGFEBlendElement;
    'svg:feColorMatrix': SVGFEColorMatrixElement;
    'svg:feComponentTransfer': SVGFEComponentTransferElement;
    'svg:feComposite': SVGFECompositeElement;
    'svg:feConvolveMatrix': SVGFEConvolveMatrixElement;
    'svg:feDiffuseLighting': SVGFEDiffuseLightingElement;
    'svg:feDisplacementMap': SVGFEDisplacementMapElement;
    'svg:feDistantLight': SVGFEDistantLightElement;
    'svg:feDropShadow': SVGFEDropShadowElement;
    'svg:feFlood': SVGFEFloodElement;
    'svg:feFuncA': SVGFEFuncAElement;
    'svg:feFuncB': SVGFEFuncBElement;
    'svg:feFuncG': SVGFEFuncGElement;
    'svg:feFuncR': SVGFEFuncRElement;
    'svg:feGaussianBlur': SVGFEGaussianBlurElement;
    'svg:feImage': SVGFEImageElement;
    'svg:feMerge': SVGFEMergeElement;
    'svg:feMergeNode': SVGFEMergeNodeElement;
    'svg:feMorphology': SVGFEMorphologyElement;
    'svg:feOffset': SVGFEOffsetElement;
    'svg:fePointLight': SVGFEPointLightElement;
    'svg:feSpecularLighting': SVGFESpecularLightingElement;
    'svg:feSpotLight': SVGFESpotLightElement;
    'svg:feTile': SVGFETileElement;
    'svg:feTurbulence': SVGFETurbulenceElement;
    'svg:filter': SVGFilterElement;
    'svg:foreignObject': SVGForeignObjectElement;
    'svg:g': SVGGElement;
    'svg:image': SVGImageElement;
    'svg:line': SVGLineElement;
    'svg:linearGradient': SVGLinearGradientElement;
    'svg:marker': SVGMarkerElement;
    'svg:mask': SVGMaskElement;
    'svg:metadata': SVGMetadataElement;
    'svg:mpath': SVGMPathElement;
    'svg:path': SVGPathElement;
    'svg:pattern': SVGPatternElement;
    'svg:polygon': SVGPolygonElement;
    'svg:polyline': SVGPolylineElement;
    'svg:radialGradient': SVGRadialGradientElement;
    'svg:rect': SVGRectElement;
    'svg:script': SVGScriptElement;
    'svg:set': SVGSetElement;
    'svg:stop': SVGStopElement;
    'svg:style': SVGStyleElement;
    'svg:svg': SVGSVGElement;
    'svg:switch': SVGSwitchElement;
    'svg:symbol': SVGSymbolElement;
    'svg:text': SVGTextElement;
    'svg:textPath': SVGTextPathElement;
    'svg:title': SVGTitleElement;
    'svg:tspan': SVGTSpanElement;
    'svg:use': SVGUseElement;
    'svg:view': SVGViewElement;
}

export type IntrinsicElementTypes = keyof IntrinsicElementTypeMap;