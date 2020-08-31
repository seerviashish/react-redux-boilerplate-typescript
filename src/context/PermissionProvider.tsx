import React, { ReactNode } from "react";
import {
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  Container,
  CssBaseline,
  LinearProgress,
  Paper,
  Typography,
  CardContent,
  Card,
  CardActions,
  Button,
  CardHeader,
  Snackbar,
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { cdb } from "src/db/ClientDB";
import { db } from "src/db/AppDB";
import { yellow } from "@material-ui/core/colors";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export type AppPermission = {
  key: string;
  name: string;
  required: boolean;
  runtime: boolean;
  info: string;
  isAllowed: boolean;
};

export type PermissionContextType = {
  resolved?: boolean;
  loading: boolean;
  error?: any;
  permissions: AppPermission[];
  requestForPermission?: (key: string) => Promise<number>;
  isLocationPermissionAllowed?: () => Promise<boolean>;
  isCameraPermissionAllowed?: () => Promise<boolean>;
  isMicrophonePermissionAllowed?: () => Promise<boolean>;
  isNotificationsPermissionAllowed?: () => Promise<boolean>;
  isOnline?: () => boolean;
};

const requiredPermissions: AppPermission[] = [
  {
    key: "geolocation",
    name: "Location",
    required: false,
    runtime: true,
    info:
      "Please allow Location permission for this site. This will be used to find groups or person nearest to you nearest.",
    isAllowed: false,
  },
  {
    key: "camera",
    name: "Camera",
    required: false,
    runtime: true,
    info:
      "Please allow Camera permission for this site. This will be used for video call service.",
    isAllowed: false,
  },
  {
    key: "microphone",
    name: "Microphone",
    required: false,
    runtime: true,
    info:
      "Please allow Microphone permission for this site. This will be used for voice call or voice message.",
    isAllowed: false,
  },
  {
    key: "notification",
    name: "Notification",
    required: false,
    runtime: true,
    info:
      "Please allow Notification permission for this site to get notified during receive message.",
    isAllowed: false,
  },
  {
    key: "cookie",
    name: "Cookie",
    required: true,
    runtime: false,
    info:
      "Please allow cookie permission for this site. This website uses cookies We use cookies to personalize content.",
    isAllowed: false,
  },
  {
    key: "app-storage",
    name: "LocalStorage and SessionStorage",
    required: true,
    runtime: false,
    info:
      "Please allow permission to store data in LocalStorage, IndexedDB, SessionStorage. This website uses local storage, session storage and database to personalize content.",
    isAllowed: false,
  },
];

const defaultContext: PermissionContextType = {
  resolved: undefined,
  loading: true,
  error: undefined,
  permissions: [],
};

const Context = React.createContext<PermissionContextType>(defaultContext);

const { Consumer, Provider } = Context;

export { Consumer, Context };

type Props = {
  children: ReactNode;
};

type State = {
  resolved: boolean;
  loading: boolean;
  error?: any;
  permissions: AppPermission[];
  warnMessage: string;
  warnMessageOpen: boolean;
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      margin: 0,
      padding: 0,
      maxWidth: "100%",
    },
    loading: {
      height: "0.5rem",
      width: "100%",
    },
    paperSection: {
      margin: "10vh auto",
      padding: theme.spacing(2),
      [theme.breakpoints.down("sm")]: {
        width: "85%",
      },
      [theme.breakpoints.between("sm", "md")]: {
        width: "80%",
      },
      [theme.breakpoints.between("md", "xl")]: {
        width: "50%",
      },
      [theme.breakpoints.up("xl")]: {
        width: "50%",
      },
    },
    card: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
    },
    cardAction: {
      justifyContent: "flex-end",
    },
  });

class PermissionProvider extends React.Component<
  Props & WithStyles<typeof styles>,
  State
> {
  readonly state: State = {
    resolved: false,
    loading: true,
    error: null,
    permissions: [],
    warnMessage: "",
    warnMessageOpen: false,
  };

  requestForPermission = async (key: string): Promise<number> => {
    try {
      const requestPermission = this.state.permissions.filter(
        (data: AppPermission) =>
          data.key === key &&
          ["camera", "microphone", "notification", "geolocation"].includes(key)
      );
      if (requestPermission.length === 1) {
        const permissionState = await navigator.permissions.query({
          name: key as PermissionName,
        });
        if (permissionState.state === "granted") {
          return 1;
        } else if (permissionState.state === "prompt") {
          return 2;
        } else {
          throw new Error(
            `Permission of ${requestPermission[0].name} is required!`
          );
        }
      } else {
        throw new Error(`Permission function didn't configured for ${key}`);
      }
    } catch (error) {
      this.setState({
        warnMessageOpen: true,
        warnMessage: error.message ?? "Permission error!",
      });
      return 0;
    }
  };

  // In future need to implement by using event driven function to listen network status.
  isOnline = (): boolean => {
    try {
      return navigator && navigator.onLine;
    } catch (error) {
      return false;
    }
  };

  isCookieEnabled = (): boolean => {
    try {
      return navigator && navigator.cookieEnabled;
    } catch (error) {
      return false;
    }
  };

  isDBOpen = async (): Promise<boolean> => {
    try {
      await cdb.open();
      await db.open();
      return true;
    } catch (error) {
      return false;
    }
  };

  isAppStorageAllowed = async (): Promise<boolean> => {
    try {
      let localAnsSessionStorage = false;
      if (window.localStorage && window.sessionStorage) {
        localAnsSessionStorage = true;
      }
      const database = await this.isDBOpen();
      return localAnsSessionStorage && database;
    } catch (error) {
      return false;
    }
  };

  isLocationPermissionAllowed = async (): Promise<boolean> => {
    try {
      const permissionState = await navigator.permissions.query({
        name: "geolocation",
      });
      return permissionState.state === "granted";
    } catch (error) {
      return false;
    }
  };

  isCameraPermissionAllowed = async (): Promise<boolean> => {
    try {
      const permissionState = await navigator.permissions.query({
        name: "camera",
      });
      return permissionState.state === "granted";
    } catch (error) {
      return false;
    }
  };

  isMicrophonePermissionAllowed = async (): Promise<boolean> => {
    try {
      const permissionState = await navigator.permissions.query({
        name: "microphone",
      });
      return permissionState.state === "granted";
    } catch (error) {
      return false;
    }
  };

  isNotificationsPermissionAllowed = async (): Promise<boolean> => {
    try {
      const permissionState = await navigator.permissions.query({
        name: "notifications",
      });
      return permissionState.state === "granted";
    } catch (error) {
      return false;
    }
  };

  componentDidMount() {
    Promise.allSettled([
      this.isOnline(),
      this.isCookieEnabled(),
      this.isAppStorageAllowed(),
      this.isLocationPermissionAllowed(),
      this.isCameraPermissionAllowed(),
      this.isMicrophonePermissionAllowed(),
      this.isNotificationsPermissionAllowed(),
    ])
      .then((permissionResponse) => {
        const isOnline: boolean =
          permissionResponse[0].status === "fulfilled" &&
          permissionResponse[0].value;
        const permissions = requiredPermissions.map(
          (permissionObj: AppPermission) => {
            if (permissionObj.key === "cookie") {
              permissionObj.isAllowed =
                permissionResponse[1].status === "fulfilled"
                  ? permissionResponse[1].value
                  : false;
            }
            if (permissionObj.key === "app-storage") {
              permissionObj.isAllowed =
                permissionResponse[2].status === "fulfilled" &&
                permissionResponse[2].value;
            }
            if (permissionObj.key === "location") {
              permissionObj.isAllowed =
                permissionResponse[3].status === "fulfilled" &&
                permissionResponse[3].value;
            }
            if (permissionObj.key === "camera") {
              permissionObj.isAllowed =
                permissionResponse[4].status === "fulfilled" &&
                permissionResponse[4].value;
            }
            if (permissionObj.key === "microphone") {
              permissionObj.isAllowed =
                permissionResponse[5].status === "fulfilled" &&
                permissionResponse[5].value;
            }
            if (permissionObj.key === "notification") {
              permissionObj.isAllowed =
                permissionResponse[6].status === "fulfilled" &&
                permissionResponse[6].value;
            }
            return permissionObj;
          }
        );
        const isResolved: boolean =
          permissions.filter(
            (data: AppPermission) => data.required && !data.isAllowed
          ).length === 0;
        this.setState((prevState: State, props: Props) => {
          return {
            permissions,
            resolved: isResolved,
            loading: false,
            warnMessageOpen: !isOnline,
            warnMessage: "You are not connected to internet!",
          };
        });
      })
      .catch((error: any) => {
        this.setState((prevState: State, props: Props) => {
          return {
            resolved: false,
            loading: false,
            error: error.message ? `${error.message}` : "Something went wrong!",
          };
        });
      });
  }

  handleMessageClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ warnMessageOpen: false });
  };

  render() {
    const {
      resolved,
      loading,
      error,
      permissions,
      warnMessageOpen,
      warnMessage,
    } = this.state;
    const { classes } = this.props;
    if (!resolved) {
      let child: ReactNode = null;
      if (loading) {
        child = <LinearProgress className={classes.loading} />;
      } else if (!loading && error) {
        child = (
          <Paper elevation={3} className={classes.paperSection} component="div">
            <ErrorIcon color="error" />
            <Typography
              component="h5"
              variant="h5"
              style={{ color: yellow[700] }}
            >
              {"Error"}
            </Typography>
            <Typography
              component="pre"
              variant="body2"
              style={{ overflowX: "auto", whiteSpace: "pre-wrap" }}
            >
              {`ErrorInfo : ${error}`}
            </Typography>
          </Paper>
        );
      } else if (
        !loading &&
        !error &&
        permissions.filter(
          (data: AppPermission) => data.required && !data.isAllowed
        ).length > 0
      ) {
        child = (
          <Paper elevation={3} className={classes.paperSection} component="div">
            {permissions
              .filter((data: AppPermission) => data.required && !data.isAllowed)
              .map((data: AppPermission, index: number) => {
                return (
                  <Card
                    key={`permission-card-${index}`}
                    className={classes.card}
                    variant="outlined"
                  >
                    <CardHeader
                      avatar={
                        <ErrorOutlineIcon
                          style={{ color: yellow[700], margin: 4 }}
                        />
                      }
                      title={
                        <Typography component="h5" variant="h5" gutterBottom>
                          {data.name}
                        </Typography>
                      }
                    />
                    <CardContent>
                      <Typography
                        component="p"
                        variant="body2"
                        style={{ overflowX: "auto", whiteSpace: "pre-wrap" }}
                      >
                        {data.info}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
          </Paper>
        );
      } else {
        child = (
          <Paper elevation={3} className={classes.paperSection} component="div">
            <Card className={classes.card} variant="outlined">
              <CardHeader
                avatar={
                  <ErrorOutlineIcon style={{ color: yellow[700], margin: 4 }} />
                }
                title={
                  <Typography component="h5" variant="h5" gutterBottom>
                    {"Help - Unknown Error"}
                  </Typography>
                }
              />
              <CardContent>
                <Typography
                  component="p"
                  variant="body2"
                  style={{ overflowX: "auto", whiteSpace: "pre-wrap" }}
                >
                  {
                    "Something went wrong! Please try to contact developer to resolve issue with client application."
                  }
                </Typography>
              </CardContent>
              <CardActions className={classes.cardAction}>
                <Button
                  href="mailto:help@messageapp.com"
                  size="small"
                  variant="outlined"
                  aria-label="Contact developer button"
                >
                  Contact Us
                </Button>
              </CardActions>
            </Card>
          </Paper>
        );
      }
      return (
        <React.Fragment>
          <CssBaseline />
          <Container className={classes.container} component="section">
            {child}
          </Container>
        </React.Fragment>
      );
    }
    return (
      <Provider
        value={{
          ...this.state,
          isOnline: this.isOnline,
          requestForPermission: this.requestForPermission,
          isCameraPermissionAllowed: this.isCameraPermissionAllowed,
          isLocationPermissionAllowed: this.isLocationPermissionAllowed,
          isMicrophonePermissionAllowed: this.isMicrophonePermissionAllowed,
          isNotificationsPermissionAllowed: this
            .isNotificationsPermissionAllowed,
        }}
      >
        {this.props.children}
        <Snackbar
          open={warnMessageOpen}
          autoHideDuration={5000}
          onClose={this.handleMessageClose}
        >
          <Alert onClose={this.handleMessageClose} severity="warning">
            {warnMessage}
          </Alert>
        </Snackbar>
      </Provider>
    );
  }
}

export default withStyles(styles)(PermissionProvider);
