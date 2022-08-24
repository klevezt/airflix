import { Home } from '@mui/icons-material';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { removeUpperAccents } from '../../Helpers/Functions/functions';
import IconButton from '../UI/Buttons/IconButton';

const PageNotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="page-not-found">
      <h2>404 - {t("page_not_found")}</h2>
      <h4>{t("page_not_found_description")}</h4>
      <div className="bg-main-color">
        <IconButton
          text={removeUpperAccents(t("sidebar_home"))}
          icon={<Home className="mr-2" />}
          variant="contained"
          color="primary"
          className="w-auto px-3 py-2"
        />
      </div>
    </div>
  );
}

export default PageNotFound