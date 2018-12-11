const { forwardTo } = require('prisma-binding');
const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, ctx, info) {
        // check if there is any current user
        if (!ctx.request.userId) {
            return null;
        }
        return ctx.db.query.user({
            where: { id: ctx.request.userId }
        }, info)
    }
    // async items(parent, args, ctx, info) {
    //     const items = await ctx.db.query.item();
    //     return items;
    // }
};

module.exports = Query;
