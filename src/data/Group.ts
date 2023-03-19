export interface Group {
  filePath: string
  extension: string
}

export const getTestGroups = (groupsString: string): Group[] => {
  return groupsString.split(',').map(groupData => {
    const [filePath, extension] = groupData.split(':')
    return {filePath, extension} as Group
  })
}
