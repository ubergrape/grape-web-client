import zIndex from 'material-ui/styles/zIndex'

export default {
  ...zIndex,
  // Need to override this to let Popover component be higher then 3000.
  //
  // Jira using body as a drag & drop handler, and to let embedded chat
  // be higher then Jira handler, chat container should have zIndex 3000,
  // to let chat d & d file upload work beside with Jira d & d. As a result
  // Popover will be not visible, because of default value of z-index in 1500.
  dialog: 4000,
}
