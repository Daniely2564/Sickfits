const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { hasPermission } = require("../utils");

const Mutations = {
  async createItem(parent, args, ctx, info) {
    //To DO if logged in
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );

    return item;
  },
  async updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args };
    // remove ID from the updates
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    throw new Error("You aren't allow!");
    const where = { id: args.id };
    // find the item
    const item = await ctx.db.query.item({ where }, `{ id, title, user{id} }`);
    // check if they own that item, or have the permission
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermission = ctx.request.user.permissions.some(p =>
      ["ADMIN", "ITEMDELTE"].includes(p)
    );
    if (!ownsItem && !hasPermission)
      throw new Error("You don't have permission to do that");

    // delete it
    console.log("deleting ...");
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    // make it lwoercase
    args.email = args.email.toLowerCase();
    // hash Password
    const password = await bcrypt.hash(args.password, 10);
    // create user in the db
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );
    // automatically sign in
    // create jwt token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // we set jwt as a cookie on the response.
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
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
      throw new Error("Invalid Password");
    }
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set the cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "GoodBye!" };
  },
  async requestReset(parent, args, ctx, info) {
    // 1. check if it is the real user.
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error("No user was found");
    }

    // 2. Set a reset token and expiry on that user
    const promisifiedRandombyes = promisify(randomBytes);
    const resetToken = (await promisifiedRandombyes(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; //1 hour from now.
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });
    console.log(res);
    // 3. Email them that reset token
    return { message: "HAHA" };
  },
  async resetPassword(parent, args, ctx, info) {
    //1 Check if the password matches
    if (args.password !== args.confirmPassword) {
      throw new Error(`Passwords Don't Match`);
    }
    //2 Check if its legit token
    //3 Check if its expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });
    if (!user) {
      throw new Error("This token is either invalid or expired");
    }
    //4 Hash new password
    const newPass = await bcrypt.hash(args.password, 10);
    //5 Save new password to the user
    //6 remove old reset token field.
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password: newPass,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    //7 Generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    //8 Set the jwt cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });
    //9 return new user
    return updatedUser;
  },
  async updatePermissions(parent, args, ctx, info) {
    // 1. check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in!");
    }
    // 2. Query the current User
    const currentUser = await ctx.db.query.user(
      { where: { id: ctx.request.userId } },
      info
    );

    // 3. check if they have permissions to Do this.
    hasPermission(currentUser, ["ADMIN", "PERMISSIONUPDATE"]);
    // 4. update the permissions.
    return await ctx.db.mutation.updateUser(
      {
        where: { id: args.userId },
        data: {
          permissions: {
            set: args.permissions
          }
        }
      },
      info
    );
  },
  async addToCart(parent, args, ctx, info) {
    // 1. Make sure they are signed in
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("You must be signed in!");
    }
    // 2. Query the users current cart
    const [existingCartItem] = ctx.db.query.cartItems({
      user: { id: userId },
      item: { id: args.id }
    });

    // 3. Check if that item is already in cart and increment
    //  by one if it does
    if (existingCartItem) {
      console.log("The Item is already in the cart");
      return ctx.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 }
      });
    }

    // 4. if not, create a fresh cart Item for that user!
    return ctx.db.mutation.createCartItem({
      user: { connect: { id: userId } },
      item: { connect: { id: args.id } }
    });
  }
};

module.exports = Mutations;
