import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoApp } from '@fastgpt/service/core/app/schema';
import { mongoRPermission } from '@fastgpt/global/support/permission/utils';
import { AppListItemType } from '@fastgpt/global/core/app/type';
import { authUserRole } from '@fastgpt/service/support/permission/auth/user';
import { NextAPI } from '@/service/middleware/entry';

async function handler(req: NextApiRequest, res: NextApiResponse<any>): Promise<AppListItemType[]> {
  // 凭证校验
  const { teamId, tmbId, teamOwner, role } = await authUserRole({ req, authToken: true });

  // 根据 userId 获取模型信息
  const myApps = await MongoApp.find(
    { ...mongoRPermission({ teamId, tmbId, role }) },
    '_id avatar name intro tmbId permission'
  ).sort({
    updateTime: -1
  });

  return myApps.map((app) => ({
    _id: app._id,
    avatar: app.avatar,
    name: app.name,
    intro: app.intro,
    isOwner: teamOwner || String(app.tmbId) === tmbId,
    permission: app.permission
  }));
}

export default NextAPI(handler);
