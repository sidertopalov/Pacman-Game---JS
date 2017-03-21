<?php

include_once "db_conn.php";

?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Pacman Dashboard!</title>
    <link rel="stylesheet" href="library/css/bootstrap.min.css">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="assets/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png">
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
</head>
<body>
    <div class="wrapper">
        <div class="container">

            <div class="page-header text-center">
                <h1>Dashboard</h1>
            </div>

            <div class="row">
                
                <!-- Left side -->
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"> 
                     <div class="text-left">

                        <div>
                            <a href="index.html"><i class="fa fa-home fa-lg"></i> Home</a>
                        </div>

                        <div>
                            <a href="pacman.html"><i class="fa fa-play fa-lg"></i> Play Kingman!</a>
                        </div>

                    </div>
                </div> <!-- end left side -->

                <!-- Middle side -->
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">

                    <div class="row text-center">
                        <b>Top 10 best players</b>
                    </div>

                    <table class="table table-responsive">
                        <table class="table table-sm table-inverse">
                            <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Nickname</th>
                                  <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                            <?php

                                $model = new Db();
                                $highesScores = $model->highesPlayerScores();
                                $allPlayers = $model->getAllPlayers();
                                $overAll = count($allPlayers);
                                $place = 1;
                                foreach ($highesScores as $playerStats) {
                                    $playerName = $playerStats[0];
                                    $playerScore = $playerStats[1];

                                    echo "<tr>
                                            <th scope='row'>$place</th>
                                            <td>$playerName</td>
                                            <td>$playerScore</td>
                                        </tr>";
                                    $place++;
                                }
                                echo "<tr>
                                        <td colspan='3' class='text-center'>Over <b>$overAll</b> players.</td>
                                    </tr>"
                            ?>
                            </tbody>
                        </table>
                    </table>

                </div> <!-- end middle side -->

                <!-- Right side -->
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">

                </div> <!-- end right side -->

            </div> <!-- end row -->

        </div> <!-- end container -->

    <!-- Scripts -->
    <script src="library/js/jquery.min.js"></script>
    
    </div><!-- end wrapper -->
</body>
</html>
