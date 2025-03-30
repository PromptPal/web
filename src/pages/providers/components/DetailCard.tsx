import { ReactNode } from 'react'

type DetailCardProps = {
  title: string
  children: ReactNode
  className?: string
}

export function DetailCard({
  title,
  children,
  className = '',
}: DetailCardProps) {
  return (
    <div
      className={`rounded-xl p-[2px] bg-gradient-to-br from-primary/20 via-secondary/10 to-background/5 overflow-hidden shadow-md hover:shadow-primary/5 transition-all duration-300 ${className}`}
    >
      <div className='rounded-lg bg-card/80 p-6 backdrop-blur-xl h-full'>
        <h2 className='text-xl font-semibold mb-4 text-foreground/90'>
          {title}
        </h2>
        <div className='space-y-4'>{children}</div>
      </div>
    </div>
  )
}
