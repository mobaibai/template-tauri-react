type JSONValue = string | number | boolean | null | { [k: string]: JSONValue } | JSONValue[]

type RequestQueryType = {
  query: Record<string, string>
}

type ItemType = {
  id?: string | number
}

type ResponseDataListType = {
  list: ItemType[]
  query: Record<string, any>
  pages: {
    page: number
    per: number
    total_page: number
  }
}

type DataType<R> = {
  code: number
  data: R
}

type SystemInfo = {
  key: string
  name: string
  value: any
}
