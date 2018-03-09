import parse from 'mdurl/parse'

export default (url) => {
  const parsed = parse(url)
  return {
    ...parsed,
    host: parsed.port ? `${parsed.hostname}:${parsed.port}` : parsed.hostname
  }
}
