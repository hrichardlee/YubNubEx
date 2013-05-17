set CHROME_INSTALL_LOCATION="%programfiles% (x86)\Google\Chrome\Application\chrome.exe"

%CHROME_INSTALL_LOCATION% --pack-extension=%cd%\NoStone --pack-extension-key=%cd%\bin\nostone.pem --no-message-box

del bin\NoStone.crx
move NoStone.crx bin\NoStone.crx