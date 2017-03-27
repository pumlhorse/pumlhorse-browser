import * as _ from 'underscore';
import * as Browser from 'zombie';
import { ICancellationToken } from './ICancellationToken';
import { CancellationToken } from "./CancellationToken";
import enforce from './enforce';
import { Zombie } from "./Zombie";
import { Dom } from "./Dom";

export function init(pumlhorse: IPumlhorseGlobal){
    pumlhorse.module('pumlhorse-browser')
        .injector('$browser', getBrowser)
        /* Set up */
        .function('setBaseUrl', setBaseUrl)
        .function('setProxy', setProxy)
        /* Browser Actions */
        .function('open', open)
        .function('click', click)
        .function('set', setValue)
        .function('wait', wait)
        .function('check', check)
        .function('uncheck', uncheck)
        .function('choose', choose)
        .function('select', select)
        .function('unselect', unselect)
        .function('attachFile', attachFile)
        /* DOM */
        .function('find', find)
        .function('findFirst', findFirst)
        /* Cookies */
        .function('getCookie', getCookie)
        .function('setCookie', setCookie)
        .function('deleteCookie', deleteCookie)
        /* Assertions */
        .function('isUrl', isUrl)
        /* Internals */
        .function('_getBrowser', getBrowser);
}

/* Set up */

function setBaseUrl(baseUrl: string, $browser: Zombie.IBrowser): void {
    enforce(baseUrl, 'baseUrl').isString().isNotNull();

    $browser.localhost(baseUrl);
}

function setProxy(proxyUrl: string, $browser: Zombie.IBrowser): void {
    enforce(proxyUrl, 'proxyUrl').isString().isNotNull();

    $browser.proxy = proxyUrl;
}

/* Browser Actions */

function open(url: string, $browser: Zombie.IBrowser, $cancellationToken: ICancellationToken): Promise<any> {
    enforce(url, 'url').isString().isNotNull();

    return CancellationToken.await($browser.visit(url), $cancellationToken);
}

function click(selector: string | ReadOnlyDom, $browser: Zombie.IBrowser, $cancellationToken: ICancellationToken): Promise<any> {
    enforce(selector, 'selector').isNotNull();

    return CancellationToken.await($browser.click(getSelectorOrElement(selector)), $cancellationToken);
}

function setValue(selector: string | ReadOnlyDom, value: string, $browser: Zombie.IBrowser): void {
    enforce(selector, 'selector').isNotNull();

    $browser.fill(getSelectorOrElement(selector), value);
}

function check(selector: string | ReadOnlyDom, $browser: Zombie.IBrowser): void {
    enforce(selector, 'selector').isNotNull();

    $browser.check(getSelectorOrElement(selector));
}

function uncheck(selector: string | ReadOnlyDom, $browser: Zombie.IBrowser): void {
    enforce(selector, 'selector').isNotNull();

    $browser.uncheck(getSelectorOrElement(selector));
}

function choose(selector: string | ReadOnlyDom, $browser: Zombie.IBrowser): void {
    enforce(selector, 'selector').isNotNull();

    $browser.choose(getSelectorOrElement(selector));
}

function select(selector: string | ReadOnlyDom, value: string, $browser: Zombie.IBrowser): void {
    enforce(selector, 'selector').isNotNull();
    enforce(value, 'value').isString();

    value == null
        ? $browser.selectOption(getSelectorOrElement(selector))
        : $browser.select(getSelectorOrElement(selector), value);
}

function unselect(selector: string | ReadOnlyDom, value: string, $browser: Zombie.IBrowser): void {
    enforce(selector, 'selector').isNotNull();
    enforce(value, 'value').isString();

    value == null
        ? $browser.unselectOption(getSelectorOrElement(selector))
        : $browser.unselect(getSelectorOrElement(selector), value);
}

function attachFile(selector: string | ReadOnlyDom, file: string, $browser: Zombie.IBrowser): void {
    enforce(selector, 'selector').isNotNull();
    enforce(file, 'file').isString().isNotNull();

    $browser.choose(getSelectorOrElement(selector));
}

function wait(duration: string | number, $browser: Zombie.IBrowser, $cancellationToken: ICancellationToken): Promise<any> {
    return CancellationToken.await($browser.wait(duration), $cancellationToken);    
}

/* DOM */

function findFirst(selector: string, $browser: Zombie.IBrowser): ReadOnlyDom[] {
    enforce(selector, 'selector').isString().isNotNull();

    return $browser.queryAll(selector).map(elem => new ReadOnlyDom(elem));
}

function find(selector: string, $browser: Zombie.IBrowser): ReadOnlyDom {
    enforce(selector, 'selector').isString().isNotNull();

    var elem = $browser.query(selector);
    return elem == null
        ? null
        : new ReadOnlyDom(elem);
}

function getSelectorOrElement(val: string | ReadOnlyDom): string | Dom.Element {
    if (_.isString(val)) return <string>val;

    return (<ReadOnlyDom>val).getDomElement();
}

class ReadOnlyDom {
    attributes: {[name: string]: string};
    classList: string[];
    id: string;
    localName: string;
    name: string;
    prefix: string;
    textContent: string;
    value: string;

    constructor(private element: Dom.Element) {
        this.attributes = {};
        for (var i = 0; i < element.attributes.length; i++)
        {
            var attr = element.attributes.item(i);
            this.attributes[attr.localName] = attr.value;
        }
        this.classList = element.classList;
        this.id = element.id;
        this.localName = element.localName;
        this.name = element.name;
        this.prefix = element.prefix;
        this.textContent = element.textContent;
        this.value = element.value;
    }

    getDomElement() {
        return this.element;
    }
}



/* Cookies */

function getCookie(selector: string, $scope: IScope): Zombie.ICookie {
    enforce(selector, 'selector').isString().isNotNull();
    const browser = getBrowser($scope);

    return <Zombie.ICookie>browser.getCookie(selector, true);
}

function setCookie(name: string, value: string | Zombie.ICookie, $scope: IScope) {
    enforce(name, 'name').isString().isNotNull();
    enforce(value, 'value').isNotNull();

    const browser = getBrowser($scope);

    if (_.isString(value)) {
        browser.setCookie(name, <string>value);
    }
    else {
        const cookie: Zombie.ICookie = <Zombie.ICookie>value;
        cookie.name = name;
        browser.setCookie(cookie);
    }
}

function deleteCookie(names: string | string[], $scope: IScope) {
    enforce(names, 'names').isNotNull();
    
    const browser = getBrowser($scope);
    const cookieNames: string[] = _.isString(names)
        ? [<string>names]
        : <string[]> names;
    
    for (var i = 0; i < cookieNames.length; i++) {
        browser.deleteCookie(cookieNames[i]);
    }
}

/* Assertions */

function isUrl(url: string, $scope: IScope) {
    enforce(url, 'url').isString().isNotNull();

    const browser = getBrowser($scope);
    browser.assert.url(url);
}

/* Internals */

function getBrowser($scope: IScope) {
    if ($scope.__zombie_browser == null) {
        $scope.__zombie_browser = new Browser();
    }

    return $scope.__zombie_browser;
}

interface IPumlhorseGlobal {
    module(moduleName: string): IModuleBuilder;
}

interface IModuleBuilder {
    function(name: string, func: Function | any[]): IModuleBuilder;
    injector(name, func: (($scope: IScope) => any)): IModuleBuilder;
    export(): Object;
}

interface IScope {
    __zombie_browser: Zombie.IBrowser;
}