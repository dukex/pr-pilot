import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars

// TODO: get the head branch from configuration
const isAMergeDemmand = (body: String) => body.indexOf("@pr-pilot merge qa") > -1

const pullParams = (data: any) => {
    data['pull_number'] = data.number
    delete data.number
    return data
}

const _pullRequest = (context: Context): Promise<any> =>
    context.github.pulls.get(
        pullParams(context.repo(context.issue())))

const _checks = (context: Context, ref: string): Promise<any> =>
    context.github.checks.listSuitesForRef(context.repo({ ref: ref }))

export = (app: Application) => {
    app.on('issue_comment.created', async (context: Context) => {
        const { payload: { comment: { body } } } = context;

        if (!isAMergeDemmand(body)) {
            return;
        }

        const { data: { head: { ref } } } = await _pullRequest(context);
        const { data: { check_suites } } = await _checks(context, ref);

        console.log('checks', check_suites);


        // const { data: { sha } } =
        //     await context.github.repos.merge(context.repo({ base: 'qa', head: ref })) // TODO: get the head branch from configuration

        // // TODO: check if merge was successfully

        // await context.github.issues.createComment(context.issue({ body: `Current brach was merged in QA, ${sha}` }))

        // await context.github.issues.addLabels(context.issue({ labels: ['IN QA'] }))

        return
    })
}
