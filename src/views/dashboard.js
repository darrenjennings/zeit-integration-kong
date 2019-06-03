import { htm as html } from '@zeit/integration-utils'

export default async function dashboardView (viewData) {
  return html`
    <Box>
      <Fieldset>
        <FsContent>
          <H1>Kong API Dashboard</H1>
        </FsContent>
        <FsContent>
          <FsTitle>Your Kong plugins</FsTitle>
        </FsContent>
      </Fieldset>
		</Box>
    `
}
