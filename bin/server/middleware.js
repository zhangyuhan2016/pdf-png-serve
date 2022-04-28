module.exports = () => {
  function render(json) {
    this.set("Content-Type", "application/json")
    this.body = JSON.stringify(json)
    // console.log(this.body)
  }
  return async (ctx, next) => {
    ctx.send = render.bind(ctx)
    await next()
  }
}
