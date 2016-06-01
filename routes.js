Router.route("/", function() {
    this.layout('body')
    this.render('welcome');
});

Router.route("/connect", function() {
    this.layout('body')
    this.render('pages');
});

Router.route("/post", function() {
    this.layout("body");
    this.render('post');
});
