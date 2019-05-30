import { Application } from 'probot' // eslint-disable-line no-unused-vars

export = (app: Application) => {
    app.on('issue_comment.created', async (context) => {
        const { payload: { issue: { pull_request }, comment: { user: { login }, body } } } = context;

        if (context.isBot) {
            return
        }

        if (body.indexOf("@pr-pilot merge qa") > -1) {
            const { data: { head: { ref } } } = await
                context.github.pullRequests.get(
                    context.repo(
                        context.issue()))

            console.log('eit', context.repo({ base: 'qa', head: ref }));

            const merge = await context.github.repos.merge(
                context.repo(
                    { base: 'qa', head: ref }
                )
            )

            await context.github.issues.createComment(context.issue({ body: `Current brach was merged in QA, ${merge.data.sha}` })),

                await context.github.issues.addLabels(context.issue({ labels: ['IN QA'] }))
        }


        return

    })
}
