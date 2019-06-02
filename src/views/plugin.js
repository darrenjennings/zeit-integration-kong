// import setupView from './setup';
import rateLimiting from './plugins/rateLimiting';
import basicAuth from './plugins/basicAuth';

console.log("pluginView")

export default async function pluginView(viewData) {
    const { payload, metadata, zeitClient } = viewData;
    // const { kongAdminApiUrl, apiKey } = payload.clientState; // From form submition
    const {projectId} = payload;
    console.log("pluginView payload.action", payload.action)

    // const linkArray = payload.action.split('-')

    if (payload.action === 'rateLimiting') {
        console.log("You chose rateLimiting")
        return rateLimiting(viewData)
    } else if (payload.action === 'rateLimiting') {
        console.log("You chose basicAuth")
        return basicAuth(viewData)
    } else if (payload.action === 'done') { //Done configuring plugins
        console.log("You chose done")
        return basicAuth(viewData)
    }

    return `
            <Box>
                <Fieldset>
                    <FsContent>
                        ${payload.action === 'pluginConfigured' ? 
                        `<H1>Would you like to configure another plugin?</H1>`
                        : `<H1>Please select a plugin that you want to set up.</H1>` } 
                        
                    </FsContent>
                    <FsContent>
                        <Button action="rateLimiting">Rate Limiting</Button>
                    </FsContent>
                    <FsContent>
                        <Button action="basicAuth">Basic Authentication</Button>
                    </FsContent>
                    <FsContent>
                        <Button action="something">Something Else</Button>
                    </FsContent>
                </Fieldset>

                ${payload.action === 'pluginConfigured' ? 
                `<Button action="done">Done Configuring Plugins</Button>`
                : '' } 
            </Box>
        `
}
