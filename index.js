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

const debugTool = defineTool({
  name: 'dev_workflow_debug',
  description:
    'Diagnose whether the current DSH agent can see the development workflow tools. Use this when dev_workflow is not being called.',
  parameters: {},
  output: {
    schema: {
      type: 'string',
    },
    render: (_args, value) => [{
      type: 'text',
      text: value,
    }],
  },
  async execute(_args, exec) {
    if (!exec.agent) {
      return 'dev_workflow_debug: no calling agent was provided'
    }

    const schemas = ctx.tools.schemas(exec.agent)
    const names = schemas.map(schema => schema.name).sort()

    return [
      'dsh-dev-workflow plugin: loaded',
      `workflowEngine service: ${ctx.workflowEngine ? 'available' : 'unavailable'}`,
      `calling agent visible tools (${names.length}):`,
      ...names.map(name => `- ${name}`),
      `dev_workflow visible: ${names.includes('dev_workflow')}`,
      `dev_workflow_debug visible: ${names.includes('dev_workflow_debug')}`,
    ].join('\\n')
  },
})

const workflowTool = defineTool({
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
          { title: 'Specify' },
          { title: 'Design' },
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
})

export function apply(ctx) {
  ctx.tools.register(debugTool)
  ctx.tools.register(workflowTool)
}
