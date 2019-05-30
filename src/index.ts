import { Application } from 'probot' // eslint-disable-line no-unused-vars

export = (app: Application) => {
    app.on('issue_comment.created', async (context) => {
        if (context.isBot) { return }

        const { payload: { comment: { body } } } = context;

        if (body.indexOf("@pr-pilot merge qa") > -1) {
            const { data: { head: { ref } } } =
                await context.github.pullRequests.get(context.repo(context.issue()))

            const { data: { sha } } =
                await context.github.repos.merge(context.repo({ base: 'qa', head: ref }))

            await context.github.issues.createComment(context.issue({ body: `Current brach was merged in QA, ${sha}` }))
            await context.github.issues.addLabels(context.issue({ labels: ['IN QA'] }))
        }

        return
    })
}
