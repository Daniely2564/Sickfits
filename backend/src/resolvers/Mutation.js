const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Mutations = {
    async createItem(parent, args, ctx, info) {
        //To DO if logged in
        const item = await ctx.db.mutation.createItem({
            data: {
                ...args,
            }
        }, info);

        return item;
    },
    async updateItem(parent, args, ctx, info) {
        // first take a copy of the updates
        const updates = { ...args };
        // remove ID from the updates
        delete updates.id;
        // run the update method
        return ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
    },
    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id };
        // find the item
        const item = await ctx.db.query.item({ where }, `{ id, title }`)
        // check if they own that item, or have the permission

        // delete it
        console.log('deleting ...')
        return ctx.db.mutation.deleteItem({ where }, info)
    },
    async signup(parent, args, ctx, info) {
        // make it lwoercase
        args.email = args.email.toLowerCase();
        // hash Password
        const password = await bcrypt.hash(args.password, 10);
        // create user in the db
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions: { set: ['USER'] }
            }
        }, info);
        // automatically sign in    
        // create jwt token
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        // we set jwt as a cookie on the response.
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        // return the user to the browser
        return user;
    },
    async signin(parent, { email, password }, ctx, info) {
        const user = await ctx.db.query.user({ where: { email } });
        if (!user) {
            throw new Error(`No such user found for email ${email}`);
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Invalid Password');
        }
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        // set the cookie
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        })

        return user;
    }
};

module.exports = Mutations;
