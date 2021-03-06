## YubNubEx

YubNubEx is a Chrome extension that extends YubNub (yubnub.org). It is activated in the Omnibox by its keyword, "y". It is published on the Chrome Web Store [here](https://chrome.google.com/webstore/detail/yubnubex/nicbdnpoplkppcjbbidaikbalaelmcac?hl=en&gl=US).


### YubNub

YubNub is a command line for the web. For example,

    bim elephants

searches Bing images with the query "elephants".

    wp elephants

searches Wikipedia for "elephants".

These commands are defined by YubNub users. Normal YubNub commands work with YubNubEx, and are cached locally.


### YubNubEx Tabbing

YubNubEx lets you open command/query combinations in different tabs. Commands are separated by dots (.) and queries are separated by backticks (`). For example:

    bim.wp elephants

searches Bing images for elephants and Wikipedia for elephants in two tabs.

    bim elephants`giraffes

searches Bing images for elephants and giraffes in two tabs.

    bim.wp elephants/giraffes

will open four tabs.


### YubNubEx Overrides

The options page for the extension allows you to override the global YubNub commands.

The following types of overrides are permitted:

A normal YubNub command

    bim | http://bim.com/?q=%s

A command expansion (command alias)

    s | b.g

A parameter transformation

    gso | g site:stackoverflow.com %s
   
   
### Known Issues

Parameterized arguments are not currently supported.
