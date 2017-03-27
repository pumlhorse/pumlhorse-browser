import { URL } from 'url';
import { Dom } from "./Dom";

export namespace Zombie {
    export interface IBrowser {
        proxy: string;
        errors: string[];
        referer: string;
        assert: IBrowserAssertionProvider;

        localhost(host: string, port?: number): void;
        visit(url: string): Promise<any>;
        query(selector: string): Dom.Element;
        queryAll(selector: string): Dom.Element[];
        text(selector: string | Dom.Element): string; //Returns the text contents
        html(selector: string | Dom.Element): string; //Returns the html contents
        click(selector: string | Dom.Element): Promise<any>;
        pressButton(selector: string | Dom.Element): Promise<any>;
        fill(selector: string | Dom.Element, value: string): void; //Enters value in the input field
        check(selector: string | Dom.Element): void;
        uncheck(selector: string | Dom.Element): void;
        choose(selector: string | Dom.Element): void; //Radio button
        select(selector: string | Dom.Element, value: string): void; //Select
        unselect(selector: string | Dom.Element, value: string): void; //Select
        selectOption(selector: string | Dom.Element): void; //Select
        unselectOption(selector: string | Dom.Element): void; //Select
        attach(selector: string | Dom.Element, filename: string): void;
        wait(duration: string | number): Promise<any>;

        /* cookies */
        cookies: ICookie[];

        getCookie(identifier: string, allProperties?: boolean): string | ICookie;
        getCookie(selector: ICookieSelector, allProperties?: boolean): string | ICookie;
                
        setCookie(identifier: string, value: string);
        setCookie(cookie: ICookie);
        
        deleteCookie(identifier: string);
        deleteCookies(); //Deletes all cookies
    }

    export interface ICookie {
        name: string;
        value: string;
        domain: string;
        path: string;
        secure: boolean;
        httpOnly: boolean;
        expires: string;
        'max-age': string;
    }

    interface ICookieSelector {}

    interface IBrowserAssertionProvider {
        //Asserts that the selected element(s) has the given value for the given attribute name
        attribute(selector: string, attributeName: string, expected: string, message?: string): void;
        style(selector: string, styleName: string, expected: string, message?: string): void;
        text(selector: string, expected: string, message?: string): void;
        //Asserts that the selected element(s) has ONLY the given class name
        className(selector: string, className: string, message?: string): void;
        //Asserts that the cookie exists with the given value
        //unless value is null, in which case it asserts that the cookie does NOT exist
        cookie(identifier: string, value: string, message?: string): void;
        //Asserts that exactly one element matches the selector
        element(selector: string, message?: string): void;
        //Asserts that the given number of elements exist
        elements(selector: string, count: number | CountCriteria, message?: string): void;

        hasClass(selector: string, className: string, message?: string): void;
        hasNoClass(selector: string, className: string, message?: string): void;
        hasFocus(selector: string, message?: string): void;
        input(selector: string, expected: string, message?: string): void;
        link(selector: string, text: string, url: string, message: string): void;

        redirected(message?: string): void;
        success(message?: string): void;
        status(code: number, message?: string): void;
        url(url: string | RegExp | URL | ((currentUrl: string) => boolean), message?: string): void;
    }

    interface CountCriteria {
        atLeast?: number;
        atMost?: number;
        exactly?: number;
    }
}