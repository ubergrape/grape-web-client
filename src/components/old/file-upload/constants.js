import conf from '../../../conf'

// Max file size in bytes.
export const maxSize = conf.server.upload_file_size_limit || 50e6
