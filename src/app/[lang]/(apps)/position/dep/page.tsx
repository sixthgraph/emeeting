const positionDepPage = async ({ searchParams }: any) => {
  const { dep } = searchParams

  return (
    <>
      <h1>Position dep page</h1>
      department id : {dep}
    </>
  )
}

export default positionDepPage
