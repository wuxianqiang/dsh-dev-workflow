import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'dsh-dev-workflow'
export const inject = ['tools', 'workflowEngine']

const SCRIPT = `
const goal = args.goal

phase('Specify')
const spec = await agent(
  \`Analyze the development request below and produce a concise specification.
Request: \${goal}\`,
  { label: 'Specify' }
)

phase('Design')
const design = await agent(
  \`Design an implementation for this request.
Request: \${goal}
Specification:
\${spec}\`,
  { label: 'Design' }
)

return {
  goal,
  spec,
  design,
}
`

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'dev_workflow',
    description:
      'Run the minimal development workflow demo: Specify -> Design. Use this when the user asks to start the development workflow for a concrete implementation request.',
    parameters: {
      goal: {
        type: 'string',
        required: true,
        description: 'The development request to analyze and design.',
      },
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          goal: { type: 'string' },
          spec: { type: 'string' },
          design: { type: 'string' },
        },
        required: ['goal', 'spec', 'design'],
        additionalProperties: false,
      },
      render: (_args, value) => [{
        type: 'text',
        text: JSON.stringify(value, null, 2),
      }],
    },
    async execute(args, exec) {
      if (!exec.agent) {
        throw new Error('dev_workflow requires an agent-backed session')
      }

      const run = ctx.workflowEngine.start({
        script: SCRIPT,
        meta: {
          name: 'dev-workflow-demo',
          description: 'Minimal development workflow: Specify -> Design.',
          phases: [
            { name: 'Specify' },
            { name: 'Design' },
          ],
        },
        args: {
          goal: args.goal,
        },
        parent: exec.agent,
        signal: exec.signal,
      })

      try {
        const result = await run.result

        if (result.stopReason !== 'completed') {
          throw new Error(
            result.error || `Workflow stopped: ${result.stopReason}`
          )
        }

        return result.value
      } finally {
        await run.dispose()
      }
    },
  }))
}
