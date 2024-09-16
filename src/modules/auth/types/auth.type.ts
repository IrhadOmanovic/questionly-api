interface UserWhereByEmail {
  email: string;
  username?: never;
}

interface UserWhereByUsername {
  username: string;
  email?: never;
}

type UserWhere = UserWhereByEmail | UserWhereByUsername;
