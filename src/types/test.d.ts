type Person = {
  name: string
  age: number
}

/**
 * ts内置的泛型工具 : Pick<Person,'age'> 挑选属性
 */
type PickPerson = Pick<Person, 'name'>

/**
 * ts内置的泛型工具 : Omit<Person, 'age'> 排除某些属性
 * | 排除多个
 */
type OmitPerson = Omit<Person, 'age' | 'name'>
