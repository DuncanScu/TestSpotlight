export interface Group {
  filePath: string
  type: string
}

export const getTestGroups = (groupsString: string): Group[] => {
  return groupsString.split(',').map(groupData => {
    const [filePath, type] = groupData.split(':')
    return {filePath, type} as Group
  })
}
