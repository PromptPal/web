import DOMPurify from 'dompurify'

type Props = {
  svg: string
}

function SVGPreview({ svg }: Props) {
  const clean = DOMPurify.sanitize(svg)

  return (
    <div
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: clean }}
      className='flex-1 w-full flex justify-center items-center'
    />
  )
}

export default SVGPreview
