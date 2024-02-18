import { Divider, List, Code } from '@mantine/core'
import { CodeHighlight } from '@mantine/code-highlight'
import Youtube from 'react-youtube'
function HelpIntegration() {
  return (
    <div className='mt-10'>
      <div className='w-full flex justify-center items-center flex-col'>
        <span>We couldn`t find any data here.</span>
        <span>To use PromptPal you may can check with this video</span>
      </div>
      <Youtube className='my-4' videoId='IjfrQNRUg_I' opts={{ width: '100%', height: 400 }} />


      {/* <Divider />

      <div>
        <h3 className='text-lg font-semibold'>How to use PromptPal</h3>
        <List type='ordered'>
          <List.Item>create a project</List.Item>
          <List.Item>create a Open token</List.Item>
        </List>
        <p className='inline *:inline'>
          Download the PromptPal CLI
          <a className='mx-2 inline-block text-blue-400 hover:underline' href='https://github.com/PromptPal/cli/releases' target='_blank' rel="noreferrer">
            in github
          </a>
          extract it, and move to <Code>/usr/local/bin</Code>
        </p>
        <p>Go to your project execute following command to init it</p>
        <CodeHighlight code='promptpal init' lang='bash' />
        <p>Modify the <Code>promptpal.yaml</Code></p>
        <p>and generate your code</p>
        <CodeHighlight code='promptpal g' lang='bash' />
      </div> */}
    </div>
  )
}

export default HelpIntegration