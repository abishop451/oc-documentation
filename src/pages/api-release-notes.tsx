import React from 'react'
import {
  Theme,
  createStyles,
  makeStyles,
  List,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
} from '@material-ui/core/'
import { graphql, useStaticQuery, Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import utility from '../utility'
import Layout from '../components/Layout/Layout'
import { mediumgrey } from '../theme/ocPalette.constants'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    link: {
      textDecoration: 'none',
    },
    releaseDate: {
      float: 'right',
    },
    header: {
      marginBottom: theme.spacing(0),
      [theme.breakpoints.up('lg')]: {
        marginBottom: theme.spacing(3),
      },
    },
    title: {
      marginBottom: theme.spacing(1),
    },
    subtitle: {
      color: mediumgrey[300],
    },
    container: {},
    body: {
      paddingTop: theme.spacing(11),
      [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(5),
        paddingLeft: theme.spacing(7),
      },
    },
  })
)

interface PageData {
  allMdx: {
    totalCount: number
    edges: [
      {
        node: {
          fileAbsolutePath: string
          id: string
          frontmatter: {
            apiVersion: string
            date: string
          }
        }
      }
    ]
  }
}

interface ReleaseNotesListProps {}

export default function ReleaseNotesListComponent(
  props: ReleaseNotesListProps
) {
  const classes = useStyles(props)
  const data: PageData = useStaticQuery(graphql`
    query {
      allMdx(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: {
          fileAbsolutePath: { glob: "**/content/release-notes/**/*.mdx" }
        }
      ) {
        edges {
          node {
            id
            fileAbsolutePath
            frontmatter {
              apiVersion
              date(formatString: "dddd MMMM Do, YYYY")
            }
          }
        }
      }
    }
  `)
  return (
    <Layout>
      <Container maxWidth="md">
        <Grid container className={classes.container} spacing={3}>
          <Grid item xs={9}>
            <Helmet title={`OrderCloud Release Notes`} />
            <div className={classes.body}>
              <div className={classes.header}>
                <Typography
                  variant="h2"
                  component="h1"
                  className={classes.title}
                >
                  Release Notes
                </Typography>
                <Typography variant="subtitle1" className={classes.subtitle}>
                  Catch up on what's new in the OrderCloud API
                </Typography>
              </div>
              <List component="nav">
                {data.allMdx.edges.map(edge => {
                  const frontmatter = edge.node.frontmatter
                  return (
                    <Link
                      to={utility.resolvePath(edge.node.fileAbsolutePath)}
                      className={classes.link}
                    >
                      <Card className={classes.card}>
                        <CardContent>
                          <Typography variant="h6">
                            {`API v${frontmatter.apiVersion}`}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            className={classes.releaseDate}
                          >
                            {`released on ${frontmatter.date}`}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </List>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  )
}