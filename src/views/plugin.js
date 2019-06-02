// import setupView from './setup';
import rateLimiting from './plugins/rateLimiting';

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
    }

    return `
            <Box>
                <Fieldset>
                    <FsContent>
                        <H1>What plugin do you want to set up?</H1>
                    </FsContent>
                    <FsContent>
                        <Link action="rateLimiting" ><H2>Rate Limiting</H2></Link>
                    </FsContent>
                    <FsContent>
                        <Link action="something" ><H2>Something Else</H2></Link>
                    </FsContent>
                </Fieldset>
            </Box>
        `
}
