import { htm as html } from '@zeit/integration-utils'
import KongClient from '../../lib/kong-client';
import pluginView from '../plugin';

export default async function rateLimiting (viewData) {
  const { payload, kongClient } = viewData;
  const { routeId, second, minute, hour, day } = payload.clientState; // From form submition
  const docsURL = 'https://docs.konghq.com/hub/kong-inc/rate-limiting/'

  let error = '';

  if (payload.action === 'rateLimiting') {
    if (!second && !minute && !hour && !day) {
      error = 'At least one limit must exist. Please enter a value for Second, Minute, Hour, or Day.';
    } else {
      const resp = await kongClient.fetchEntity(`routes/${routeId}/plugins`, 'POST', {
        name: 'rate-limiting',
        config: {
          second: parseInt(second),
          minute: parseInt(minute),
          hour: parseInt(hour),
          day: parseInt(day)
        }
      })

      return pluginView(viewData)
    }
  }

  return html`
        <Box>
            <Fieldset>
                <FsContent>
                    <H1>Rate Limiting</H1>
                    <FsSubtitle>
                      <Link href="${docsURL}" target="_blank">Kong Documentation</Link>
                      Rate limit how many HTTP requests a developer can make in a given
                      period of seconds, minutes, hours, days, months or years.
                    </FsSubtitle>
                </FsContent>
                <FsContent>
                    <FsTitle>Seconds</FsTitle>
                    <FsSubtitle>The amount of HTTP requests the developer can make per second.</FsSubtitle>
                    <Input type="number" name="second" value="${second || ''}"/>
                </FsContent>
                    <FsContent>
                    <FsTitle>Minutes</FsTitle>
                    <FsSubtitle>The amount of HTTP requests the developer can make per minute.</FsSubtitle>
                    <Input type="number" name="minute" value="${minute || ''}"/>
                </FsContent>
                    <FsContent>
                    <FsTitle>Hours</FsTitle>
                    <FsSubtitle>The amount of HTTP requests the developer can make per hour.</FsSubtitle>
                    <Input type="number" name="hour" value="${hour || ''}"/>
                </FsContent>
                <FsContent>
                    <FsTitle>Days</FsTitle>
                    <FsSubtitle>The amount of HTTP requests the developer can make per day.</FsSubtitle>
                </FsContent>
                <FsContent>
                  <Input type="number" name="day" value="${day || ''}"/>
                </FsContent>
                <FsContent>
                  <Button action="rateLimiting">Submit</Button>
                </FsContent>
                <Box display="none">
                  <Input name="routeId" value="${routeId || ''}"/>
                </Box>
                <FsContent>
                  ${error ? `<Box color="red" marginBottom="20px">${error}</Box>` : ''}
                </FsContent>
            </Fieldset>
		</Box>
    `
}
