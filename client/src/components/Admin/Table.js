import React, { Suspense, useEffect, useState, useRef } from "react";
import { MDBDataTableV5 } from "mdbreact";
import { DeleteForeverSharp, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { fetchUsersFromDB } from "../../api_requests/admin_requests";

import { useStateValue } from "../../StateProvider";

function Table() {
  const [state] = useStateValue();
  const [tableState, setTableState] = useState([]);

  useEffect(() => {
    fetchUsersFromDB(state.token).then((users) => {
      setTableState(users);
    });
  }, []);

  useEffect(() => {
    tableState.forEach((user) => {
      if (user.username !== state.user.username) {
        tableRows.push({
          name: user.username,
          role: user.role,
          actions: (
            <div>
              <Link to={"/users/edit/" + user._id}>
                <Edit />
              </Link>
              <Link onClick={() => handleDeleteUser(user._id)}>
                <DeleteForeverSharp />
              </Link>
            </div>
          ),
        });
      }
    });
  }, [tableState]);

  let tableRows = [];

  const handleDeleteUser = (id) => {
    fetch("process.env.REACT_APP_SERVER_URL/users/delete/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchUsersFromDB().then((users) => {
      setTableState(users);
    });
  };

  const fetchTable = {
    columns: [
      {
        label: "Name",
        field: "name",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "Role",
        field: "role",
      },
      {
        label: "Actions",
        field: "actions",
      },
    ],
    rows: tableRows,
  };

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <MDBDataTableV5
        hover
        entriesOptions={[10, 20, 25]}
        entries={10}
        pagesAmount={4}
        data={fetchTable}
        searchBottom={true}
        barReverse
      />
    </Suspense>
  );
}

export default Table;
