import { graphql } from '@/gql'
import SelectField from '@annatarhe/lake-ui/form-select-field'
import { useQuery } from '@apollo/client'

const pl = graphql(`
  query allProviderListLiteForSelect($pagination: PaginationInput!) {
    providers(pagination: $pagination) {
      count
      edges {
        id
        name
        enabled
        source
        endpoint
      }
    }
  }
`)

type Props = {
  name: string
  label: string | React.ReactNode
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

function ProvidersSelector({ name, label, value, onChange }: Props) {
  const { data } = useQuery(pl, {
    variables: {
      pagination: {
        limit: 50,
        offset: 0,
      },
    },
  })

  const providers = data?.providers?.edges || []

  return (
    <SelectField
      label={label}
      name={name}
      options={providers.map((provider) => ({
        value: provider.id.toString(),
        label: provider.name,
      }))}
      value={value}
      onChange={onChange}
    />
  )
}

export default ProvidersSelector
