#!/usr/bin/env python3.7

# This is a script for the iTerm2 macOS Terminal to automatically open four
# split panes with everything needed to work on the web client together with
# the design system

# Install in iTerm2:
# 1. Scripts -> Manage -> Reveal Scripts in Finder
# 2. Copy grape_fronted.py to the location that just opened in Finder
# 3. (Optional) turn off annoying question when running scrpt:
#    iTerm2 -> Preferences -> Advanced -> ITERM2_COOKIE -> Yes
# 4. Run it: Scripts -> grape_frontend.py
# 5. You will be asked to download the python runtime. Download it.

# Run in iTerm2:
# Scripts -> grape_frontend.py

import iterm2


async def main(connection):
    # Get current iterm2 app and window
    app = await iterm2.async_get_app(connection)
    window = app.current_terminal_window
    if window is not None:
        await window.async_create_tab()
    else:
        print("No current window")
        exit(1)

    # Create four split panes and make the bottom left one active.
    bottomLeft = window.current_tab.current_session
    bottomRight = await bottomLeft.async_split_pane(vertical=True)
    topLeft = await bottomLeft.async_split_pane(vertical=False, before=True)
    topRight = await bottomRight.async_split_pane(vertical=False, before=True)
    await bottomLeft.async_activate()

    # Web Client Panes
    await topLeft.async_send_text('cd ~/workspace/grape/grape-web-client\n')
    await topLeft.async_send_text('yarn start:dev\n')
    await bottomLeft.async_send_text('cd ~/workspace/grape/grape-web-client\n')
    await bottomLeft.async_send_text('yarn start:proxy\n')

    # Design System Panes
    await topRight.async_send_text('cd ~/workspace/grape/grape-ds/web\n')
    await topRight.async_send_text('yarn build:lib:watch\n')
    await bottomRight.async_send_text('cd ~/workspace/grape/grape-ds/web\n')

iterm2.run_until_complete(main)
