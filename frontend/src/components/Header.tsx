type HeaderProps = {
  title: string;
  description: string;
};

export function Header(props: HeaderProps) {
  const { title, description } = props;

  return (
    <header>
      <h1>{title}</h1>
      <p className="ourclass">{description}</p>
    </header>
  );
}