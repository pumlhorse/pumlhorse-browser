export namespace Dom {
    export interface Element {
        attributes: NamedNodeMap;
        classList: string[];
        className: string;
        id: string;
        localName: string;
        name: string;
        nodeName: string;
        nodeValue: string;
        prefix: string;
        textContent: string;
        value: string;
    }

    export interface NamedNodeMap {
        item(index: number): Attribute;
        length: number;
    }

    export interface Attribute {
        localName: string;
        prefix: string;
        value: string;
    }
}