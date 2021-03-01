import React, { PureComponent } from 'react'
import {useOverlayTriggerState} from '@react-stately/overlays';
import {
  useOverlay,
  usePreventScroll,
  useModal,
  OverlayProvider,
  OverlayContainer
} from '@react-aria/overlays';
import {useDialog} from '@react-aria/dialog';
import {FocusScope} from '@react-aria/focus';
import {useButton} from '@react-aria/button';


import { TakeoverDialog } from 'aurora'


function ExampleModalDialog() {
  let state = useOverlayTriggerState({
        defaultOpen: true,
  });
  let openButtonRef = React.useRef();
  let closeButtonRef = React.useRef();

  // useButton ensures that focus management is handled correctly,
  // across all browsers. Focus is restored to the button once the
  // dialog closes.
  let {buttonProps: openButtonProps} = useButton(
    {
      onPress: () => state.open()
    },
    openButtonRef
  );

  let {buttonProps: closeButtonProps} = useButton(
    {
      onPress: () => state.close()
    },
    closeButtonRef
  );

  return (
    <div>
      <button {...openButtonProps} ref={openButtonRef}>
        Open Dialog
      </button>
      {state.isOpen && (
        <OverlayContainer>
          <TakeoverDialog
            title="Enter your name"
            isOpen
            onClose={state.close}
            isDismissable>
            <p>123 LOL i'm a dialog.</p>
          </TakeoverDialog>
        </OverlayContainer>
      )}
    </div>
  );
}

export default ExampleModalDialog