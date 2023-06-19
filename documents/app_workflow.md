| フェーズ | ユーザー                 | フロントエンド                            | バックエンド                            | データベース                         |
|:--------:|:------------------------|:-----------------------------------------|:----------------------------------------|:-------------------------------------|
|    1     | 検索クエリを入力        | → 検索クエリをGraphQL API経由で送信      |                                        |                                      |
|    1     |                        |                                         | → Elasticsearchで検索                  |                                      |
|    1     |                        |                                         | → 検索結果を返す                        |                                      |
|    1     |                        | → 検索結果を表示                          |                                        |                                      |
|    1     | 検索結果を確認         |                                         |                                        |                                      |
|    2     |                        |                                         | → Amazon EC2でウェブページをクロール   |                                      |
|    2     |                        |                                         | → spaCyとGINZAでエンティティを抽出     |                                      |
|    2     |                        |                                         | → 抽出した情報を保存                    | ← 情報を保存                         |
|    2     |                        |                                         | → Elasticsearchで情報をインデックス化 | ← 情報をインデックス化               |
|    3     | 作成した図を共有/利用  |                                         |                                        |                                      |
|    3     | フィードバックを提供   |                                         |                                        | ← フィードバックを保存               |
|    3     | 検索結果を共有         |                                         |                                        |                                      |
|    3     |                        | → 関係図をThree.jsとReact.jsで描画       |                                        |                                      |
|    3     |                        |                                         | → 新たな関係性をSageMakerで予測/保存   | ← 新たな関係性を保存                 |